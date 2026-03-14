// PortHound - Main Scanner Logic

// Global state
const scannerState = {
    target: '',
    mode: 'multi-pass',
    isScanning: false,
    currentPhase: 0,
    findings: [],
    commands: [],
    startTime: null,
    endTime: null
};

// Nmap scan configurations for different modes
const scanModes = {
    'multi-pass': {
        name: 'Multi-Pass Verification',
        phases: [
            {
                name: 'Initial Discovery',
                command: 'nmap -sS -T4 --top-ports 1000 {target}',
                description: 'Fast SYN scan of top 1000 ports'
            },
            {
                name: 'Service Verification',
                command: 'nmap -sV --version-intensity 9 -p {ports} {target}',
                description: 'Aggressive version detection on discovered ports'
            },
            {
                name: 'Script Validation',
                command: 'nmap --script vuln,exploit -p {ports} {target}',
                description: 'Vulnerability and exploit scripts'
            },
            {
                name: 'Alternative Method Confirmation',
                command: 'nmap -sT -sV -p {ports} {target}',
                description: 'Connect scan for cross-validation'
            }
        ]
    },
    'cross-validation': {
        name: 'Cross-Validation',
        phases: [
            {
                name: 'SYN Scan',
                command: 'nmap -sS -p- {target}',
                description: 'Stealth SYN scan all ports'
            },
            {
                name: 'Connect Scan',
                command: 'nmap -sT -p {ports} {target}',
                description: 'Full TCP connect validation'
            },
            {
                name: 'ACK Scan',
                command: 'nmap -sA -p {ports} {target}',
                description: 'ACK scan for firewall detection'
            },
            {
                name: 'Window Scan',
                command: 'nmap -sW -p {ports} {target}',
                description: 'Window scan verification'
            }
        ]
    },
    'timing-correlation': {
        name: 'Timing Correlation',
        phases: [
            {
                name: 'Fast Scan (T4)',
                command: 'nmap -sS -T4 -p- {target}',
                description: 'Aggressive timing scan'
            },
            {
                name: 'Normal Scan (T3)',
                command: 'nmap -sS -T3 -p {ports} {target}',
                description: 'Normal timing verification'
            },
            {
                name: 'Slow Scan (T2)',
                command: 'nmap -sS -T2 -p {ports} {target}',
                description: 'Polite timing for accuracy'
            },
            {
                name: 'Paranoid Scan (T1)',
                command: 'nmap -sS -T1 -p {ports} {target}',
                description: 'Sneaky scan final confirmation'
            }
        ]
    },
    'comprehensive': {
        name: 'Comprehensive Deep Scan',
        phases: [
            {
                name: 'Port Discovery',
                command: 'nmap -sS -p- -T4 {target}',
                description: 'All port SYN scan'
            },
            {
                name: 'Service Detection',
                command: 'nmap -sV --version-all -p {ports} {target}',
                description: 'Maximum version intensity'
            },
            {
                name: 'OS Detection',
                command: 'nmap -O --osscan-guess -p {ports} {target}',
                description: 'Operating system fingerprinting'
            },
            {
                name: 'Vulnerability Scan',
                command: 'nmap --script vuln,exploit,auth,brute -p {ports} {target}',
                description: 'Comprehensive NSE scripts'
            },
            {
                name: 'Cross-Method Validation (TCP)',
                command: 'nmap -sT -sV -p {ports} {target}',
                description: 'TCP connect verification'
            },
            {
                name: 'Alternative Scan (ACK)',
                command: 'nmap -sA -p {ports} {target}',
                description: 'ACK scan validation'
            },
            {
                name: 'Slow Confirmation',
                command: 'nmap -sS -T1 --reason -p {ports} {target}',
                description: 'Final slow scan with reasons'
            }
        ]
    }
};

// Vulnerability database for simulation
const vulnerabilityDatabase = {
    21: [
        { name: 'FTP Anonymous Access', severity: 'high', cvss: 7.5, script: 'ftp-anon' },
        { name: 'FTP vsftpd Backdoor', severity: 'critical', cvss: 9.8, script: 'ftp-vsftpd-backdoor' }
    ],
    22: [
        { name: 'SSH Weak Algorithms', severity: 'medium', cvss: 5.3, script: 'ssh2-enum-algos' },
        { name: 'SSH Default Credentials', severity: 'high', cvss: 7.5, script: 'ssh-brute' }
    ],
    80: [
        { name: 'HTTP SQL Injection', severity: 'critical', cvss: 9.8, script: 'http-sql-injection' },
        { name: 'HTTP XSS Vulnerability', severity: 'high', cvss: 7.1, script: 'http-stored-xss' },
        { name: 'HTTP Robots.txt Disclosure', severity: 'low', cvss: 3.1, script: 'http-robots.txt' }
    ],
    443: [
        { name: 'SSL Heartbleed', severity: 'critical', cvss: 9.0, script: 'ssl-heartbleed' },
        { name: 'SSL POODLE', severity: 'high', cvss: 6.8, script: 'ssl-poodle' },
        { name: 'Weak SSL Ciphers', severity: 'medium', cvss: 5.0, script: 'ssl-enum-ciphers' }
    ],
    445: [
        { name: 'SMB MS17-010 EternalBlue', severity: 'critical', cvss: 9.3, script: 'smb-vuln-ms17-010' },
        { name: 'SMB Signing Disabled', severity: 'medium', cvss: 4.3, script: 'smb-security-mode' }
    ],
    3306: [
        { name: 'MySQL Empty Password', severity: 'critical', cvss: 9.8, script: 'mysql-empty-password' },
        { name: 'MySQL Information Disclosure', severity: 'medium', cvss: 5.3, script: 'mysql-info' }
    ],
    3389: [
        { name: 'RDP MS12-020', severity: 'high', cvss: 7.8, script: 'rdp-vuln-ms12-020' },
        { name: 'RDP Encryption Weak', severity: 'medium', cvss: 5.9, script: 'rdp-enum-encryption' }
    ]
};

// Start scan function
async function startScan() {
    const target = document.getElementById('target').value.trim();
    
    if (!target) {
        showNotification('Please enter a target IP or domain', 'error');
        return;
    }

    if (scannerState.isScanning) {
        showNotification('Scan already in progress', 'warning');
        return;
    }

    // Initialize scan
    scannerState.target = target;
    scannerState.isScanning = true;
    scannerState.currentPhase = 0;
    scannerState.findings = [];
    scannerState.commands = [];
    scannerState.startTime = new Date();

    // Update UI
    document.getElementById('scanButton').classList.add('scanning');
    document.getElementById('scanButton').innerHTML = '<span class="spinner"></span> <span>Scanning...</span>';
    document.getElementById('progressSection').classList.add('active');
    document.getElementById('resultsSection').classList.remove('active');
    document.getElementById('terminal').innerHTML = '<div class="terminal-line">$ PortHound initialized...</div>';

    // Run scan
    await runMultiPassScan();
}

// Run multi-pass scanning
async function runMultiPassScan() {
    const mode = scanModes[scannerState.mode];
    const phases = mode.phases;

    // Create phase cards
    createPhaseCards(phases);

    // Simulate port discovery
    const discoveredPorts = await simulatePortDiscovery();

    // Run each phase
    for (let i = 0; i < phases.length; i++) {
        scannerState.currentPhase = i;
        updatePhaseStatus(i, 'active');
        updateProgress((i / phases.length) * 100, `Phase ${i + 1}/${phases.length}: ${phases[i].name}`);

        const command = phases[i].command
            .replace('{target}', scannerState.target)
            .replace('{ports}', discoveredPorts.join(','));

        scannerState.commands.push(command);
        addTerminalOutput(`Executing: ${command}`, 'success');

        // Simulate scan
        await simulateScanPhase(phases[i], discoveredPorts);

        updatePhaseStatus(i, 'completed');
        await sleep(800);
    }

    // Complete scan
    await completeScan();
}

// Simulate port discovery
async function simulatePortDiscovery() {
    addTerminalOutput('Starting port discovery...', 'warning');
    await sleep(1000);

    // Simulate random open ports
    const commonPorts = [21, 22, 80, 443, 445, 3306, 3389, 8080];
    const numPorts = Math.floor(Math.random() * 4) + 2; // 2-5 ports
    const discoveredPorts = [];

    for (let i = 0; i < numPorts; i++) {
        const port = commonPorts[Math.floor(Math.random() * commonPorts.length)];
        if (!discoveredPorts.includes(port)) {
            discoveredPorts.push(port);
            addTerminalOutput(`Discovered open port: ${port}/tcp`, 'success');
            await sleep(300);
        }
    }

    return discoveredPorts.sort((a, b) => a - b);
}

// Simulate scan phase
async function simulateScanPhase(phase, ports) {
    addTerminalOutput(`Running ${phase.name}...`, 'warning');
    await sleep(1500);

    // Simulate finding vulnerabilities
    for (const port of ports) {
        if (vulnerabilityDatabase[port]) {
            const vulns = vulnerabilityDatabase[port];
            for (const vuln of vulns) {
                if (Math.random() > 0.3) { // 70% chance to detect
                    // Calculate confidence based on phase
                    const confidence = calculateConfidence(phase.name, vuln);
                    
                    // Add or update finding
                    addOrUpdateFinding(port, vuln, phase.name, confidence);
                    
                    addTerminalOutput(
                        `[${vuln.severity.toUpperCase()}] Port ${port}: ${vuln.name} (Confidence: ${confidence}%)`,
                        vuln.severity === 'critical' ? 'error' : vuln.severity === 'high' ? 'warning' : 'success'
                    );
                    await sleep(400);
                }
            }
        }
    }
}

// Calculate confidence score
function calculateConfidence(phaseName, vulnerability) {
    let baseConfidence = 60;

    // Increase confidence based on phase
    if (phaseName.includes('Verification') || phaseName.includes('Validation')) {
        baseConfidence += 15;
    }
    if (phaseName.includes('Confirmation')) {
        baseConfidence += 20;
    }

    // Adjust based on severity
    if (vulnerability.severity === 'critical') {
        baseConfidence += 10;
    }

    // Add randomness
    baseConfidence += Math.floor(Math.random() * 10);

    return Math.min(100, baseConfidence);
}

// Add or update finding
function addOrUpdateFinding(port, vuln, phaseName, confidence) {
    const existingIndex = scannerState.findings.findIndex(
        f => f.port === port && f.name === vuln.name
    );

    if (existingIndex >= 0) {
        // Update existing finding
        const existing = scannerState.findings[existingIndex];
        existing.verifications.push({
            phase: phaseName,
            confidence: confidence,
            timestamp: new Date()
        });
        existing.confidence = Math.round(
            existing.verifications.reduce((sum, v) => sum + v.confidence, 0) / 
            existing.verifications.length
        );
        existing.confirmationCount++;
    } else {
        // Add new finding
        scannerState.findings.push({
            port: port,
            name: vuln.name,
            severity: vuln.severity,
            cvss: vuln.cvss,
            script: vuln.script,
            confidence: confidence,
            confirmationCount: 1,
            verifications: [{
                phase: phaseName,
                confidence: confidence,
                timestamp: new Date()
            }]
        });
    }
}

// Complete scan
async function completeScan() {
    scannerState.endTime = new Date();
    scannerState.isScanning = false;

    updateProgress(100, 'Scan Complete!');
    addTerminalOutput('Scan completed successfully', 'success');
    addTerminalOutput(`Total time: ${Math.round((scannerState.endTime - scannerState.startTime) / 1000)}s`, 'success');

    // Process findings
    processFindings();

    // Update UI
    await sleep(1000);
    document.getElementById('scanButton').classList.remove('scanning');
    document.getElementById('scanButton').innerHTML = '<span class="button-icon">🚀</span><span class="button-text">Launch PortHound Scanner</span>';
    document.getElementById('resultsSection').classList.add('active');

    // Display results
    displayResults();
}

// Process findings to categorize
function processFindings() {
    scannerState.findings.forEach(finding => {
        // Categorize based on confidence and confirmations
        if (finding.confidence >= 85 && finding.confirmationCount >= 3) {
            finding.category = 'confirmed';
        } else if (finding.confidence >= 70 && finding.confirmationCount >= 2) {
            finding.category = 'potential';
        } else {
            finding.category = 'false-positive';
        }
    });
}

// Helper functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showNotification(message, type) {
    // Simple notification - could be enhanced with a toast library
    alert(message);
}

// Initialize mode selection
document.addEventListener('DOMContentLoaded', function() {
    const modeCards = document.querySelectorAll('.mode-card');
    modeCards.forEach(card => {
        card.addEventListener('click', function() {
            modeCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            scannerState.mode = this.dataset.mode;
        });
    });
});