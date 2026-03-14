// PortHound - Verification Logic

// Display results
function displayResults() {
    displayConfidenceScore();
    displayStatistics();
    displayFindings();
    displayVerificationMethods();
    displayNmapCommands();
}

// Display overall confidence score
function displayConfidenceScore() {
    const findings = scannerState.findings;
    
    if (findings.length === 0) {
        document.getElementById('confidenceValue').textContent = '100%';
        document.getElementById('confidenceLabel').textContent = 'No vulnerabilities found';
        updateConfidenceCircle(100);
        return;
    }

    // Calculate overall confidence
    const confirmed = findings.filter(f => f.category === 'confirmed').length;
    const potential = findings.filter(f => f.category === 'potential').length;
    const falsePositive = findings.filter(f => f.category === 'false-positive').length;
    const total = findings.length;

    // Confidence formula: higher when more confirmed, lower when more false positives
    const confidence = Math.round(
        ((confirmed * 100) + (potential * 70) + (falsePositive * 30)) / total
    );

    document.getElementById('confidenceValue').textContent = confidence + '%';
    
    let label = '';
    if (confidence >= 90) {
        label = 'Very High Confidence - Results highly reliable';
    } else if (confidence >= 75) {
        label = 'High Confidence - Most results confirmed';
    } else if (confidence >= 60) {
        label = 'Medium Confidence - Manual verification recommended';
    } else {
        label = 'Low Confidence - High false positive rate detected';
    }
    
    document.getElementById('confidenceLabel').textContent = label;
    updateConfidenceCircle(confidence);
}

// Update confidence circle animation
function updateConfidenceCircle(confidence) {
    const circle = document.getElementById('confidenceProgress');
    const circumference = 2 * Math.PI * 65; // radius = 65
    const offset = circumference - (confidence / 100) * circumference;
    
    // Add gradient definition
    if (!document.querySelector('#gradient')) {
        const svg = circle.closest('svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
            </linearGradient>
        `;
        svg.insertBefore(defs, svg.firstChild);
    }
    
    circle.style.strokeDashoffset = offset;
}

// Display statistics
function displayStatistics() {
    const findings = scannerState.findings;
    
    const confirmed = findings.filter(f => f.category === 'confirmed').length;
    const potential = findings.filter(f => f.category === 'potential').length;
    const falsePositives = findings.filter(f => f.category === 'false-positive').length;
    
    document.getElementById('totalFindings').textContent = findings.length;
    document.getElementById('confirmedFindings').textContent = confirmed;
    document.getElementById('potentialFindings').textContent = potential;
    document.getElementById('falsePositives').textContent = falsePositives;
}

// Display findings
function displayFindings() {
    const container = document.getElementById('findingsContainer');
    const findings = scannerState.findings;
    
    if (findings.length === 0) {
        container.innerHTML = `
            <div class="finding-item">
                <div class="finding-header">
                    <div class="finding-title">✅ No Vulnerabilities Detected</div>
                </div>
                <div class="finding-details">
                    The target appears to be secure. All verification methods passed.
                </div>
            </div>
        `;
        return;
    }

    // Sort by severity and confidence
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    findings.sort((a, b) => {
        if (severityOrder[a.severity] !== severityOrder[b.severity]) {
            return severityOrder[a.severity] - severityOrder[b.severity];
        }
        return b.confidence - a.confidence;
    });

    container.innerHTML = '<h3>🔍 Detailed Findings</h3>';
    
    findings.forEach((finding, index) => {
        const findingHTML = createFindingHTML(finding, index);
        container.innerHTML += findingHTML;
    });
}

// Create finding HTML
function createFindingHTML(finding, index) {
    const confidenceClass = finding.confidence >= 85 ? 'high' : finding.confidence >= 70 ? 'medium' : 'low';
    const statusIcon = finding.category === 'confirmed' ? '✅' : finding.category === 'potential' ? '⚠️' : '❌';
    
    const verificationMethodsHTML = finding.verifications.map(v => `
        <span class="method-tag ${v.confidence >= 75 ? 'passed' : 'failed'}">
            ${v.phase} (${v.confidence}%)
        </span>
    `).join('');

    const nmapCommand = `nmap --script ${finding.script} -p ${finding.port} ${scannerState.target}`;

    return `
        <div class="finding-item ${finding.category}">
            <div class="finding-header">
                <div class="finding-title">
                    ${statusIcon} Port ${finding.port}/tcp - ${finding.name}
                </div>
                <span class="confidence-badge ${confidenceClass}">
                    ${finding.confidence}% Confidence
                </span>
            </div>
            
            <div class="finding-details">
                <strong>Severity:</strong> ${finding.severity.toUpperCase()} (CVSS ${finding.cvss}) | 
                <strong>Confirmations:</strong> ${finding.confirmationCount} / ${scannerState.currentPhase + 1} phases | 
                <strong>Status:</strong> ${finding.category.replace('-', ' ').toUpperCase()}
            </div>

            <div class="verification-methods">
                <strong>Verification Methods:</strong>
                ${verificationMethodsHTML}
            </div>

            <div class="finding-details">
                <strong>Analysis:</strong> 
                ${getAnalysisText(finding)}
            </div>

            <div class="nmap-command-box">
                <strong>Nmap Command:</strong> ${nmapCommand}
            </div>
        </div>
    `;
}

// Get analysis text
function getAnalysisText(finding) {
    if (finding.category === 'confirmed') {
        return `This vulnerability has been confirmed across ${finding.confirmationCount} independent verification methods with ${finding.confidence}% overall confidence. Immediate remediation recommended.`;
    } else if (finding.category === 'potential') {
        return `This finding shows moderate confidence (${finding.confidence}%). Detected in ${finding.confirmationCount} verification phases. Manual validation recommended before remediation.`;
    } else {
        return `Low confidence detection (${finding.confidence}%). Only confirmed in ${finding.confirmationCount} phase(s). Likely a false positive. Consider running additional scans or manual verification.`;
    }
}

// Display verification methods
function displayVerificationMethods() {
    const container = document.getElementById('methodologyGrid');
    const mode = scanModes[scannerState.mode];
    
    container.innerHTML = '';
    
    mode.phases.forEach(phase => {
        container.innerHTML += `
            <div class="methodology-card">
                <h4>${phase.name}</h4>
                <p>${phase.description}</p>
                <div class="nmap-command-box" style="margin-top: 10px; font-size: 0.8em;">
                    ${phase.command.replace('{target}', scannerState.target).replace('{ports}', 'detected_ports')}
                </div>
            </div>
        `;
    });
}

// Display nmap commands
function displayNmapCommands() {
    const container = document.getElementById('commandsList');
    
    container.innerHTML = '';
    
    scannerState.commands.forEach((command, index) => {
        container.innerHTML += `
            <div class="command-item">
                <strong>Command ${index + 1}:</strong> ${command}
            </div>
        `;
    });
}

// Export reports
function exportReport(format) {
    if (format === 'html') {
        exportHTMLReport();
    } else if (format === 'json') {
        exportJSONReport();
    } else if (format === 'csv') {
        exportCSVReport();
    }
}

// Export HTML report
function exportHTMLReport() {
    const findings = scannerState.findings;
    const confirmed = findings.filter(f => f.category === 'confirmed').length;
    const potential = findings.filter(f => f.category === 'potential').length;
    const falsePositive = findings.filter(f => f.category === 'false-positive').length;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PortHound Security Report - ${scannerState.target}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 40px auto; padding: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-value { font-size: 2.5em; font-weight: bold; color: #2563eb; }
        .stat-label { color: #6b7280; margin-top: 5px; }
        .finding { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 5px solid; }
        .finding.confirmed { border-left-color: #10b981; }
        .finding.potential { border-left-color: #f59e0b; }
        .finding.false-positive { border-left-color: #ef4444; opacity: 0.6; }
        .severity-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; font-size: 0.85em; }
        .critical { background: #dc3545; }
        .high { background: #fd7e14; }
        .medium { background: #ffc107; color: #333; }
        .low { background: #17a2b8; }
        .command { background: #1a1a1a; color: #00ff00; padding: 10px; border-radius: 5px; font-family: monospace; margin: 10px 0; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 PortHound Security Assessment Report</h1>
        <h2>${scannerState.target}</h2>
        <p>Generated: ${new Date().toLocaleString()}</p>
        <p>Scan Mode: ${scanModes[scannerState.mode].name}</p>
        <p>Duration: ${Math.round((scannerState.endTime - scannerState.startTime) / 1000)} seconds</p>
    </div>
    
    <div class="summary">
        <div class="stat-card">
            <div class="stat-value">${findings.length}</div>
            <div class="stat-label">Total Findings</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${confirmed}</div>
            <div class="stat-label">Confirmed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${potential}</div>
            <div class="stat-label">Potential</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${falsePositive}</div>
            <div class="stat-label">False Positives</div>
        </div>
    </div>
    
    <h2>Detailed Findings</h2>
    ${findings.map(f => `
        <div class="finding ${f.category}">
            <h3>Port ${f.port}/tcp - ${f.name} <span class="severity-badge ${f.severity}">${f.severity.toUpperCase()}</span></h3>
            <p><strong>CVSS Score:</strong> ${f.cvss} | <strong>Confidence:</strong> ${f.confidence}% | <strong>Confirmations:</strong> ${f.confirmationCount}</p>
            <p><strong>Status:</strong> ${f.category.toUpperCase().replace('-', ' ')}</p>
            <p><strong>Verification Methods:</strong> ${f.verifications.map(v => v.phase).join(', ')}</p>
            <div class="command">nmap --script ${f.script} -p ${f.port} ${scannerState.target}</div>
        </div>
    `).join('')}
    
    <h2>Executed Commands</h2>
    ${scannerState.commands.map((cmd, i) => `
        <div class="command">Command ${i + 1}: ${cmd}</div>
    `).join('')}
    
    <div style="margin-top: 40px; padding: 20px; background: white; border-radius: 8px; text-align: center;">
        <p><strong>PortHound - Advanced Nmap Scanner</strong></p>
        <p>Report generated with multi-pass verification for maximum accuracy</p>
        <p>False Positive Reduction: Active | Confidence Scoring: Enabled</p>
    </div>
</body>
</html>
    `;

    downloadFile(html, `PortHound-Report-${scannerState.target}-${Date.now()}.html`, 'text/html');
}

// Export JSON report
function exportJSONReport() {
    const report = {
        target: scannerState.target,
        scanMode: scannerState.mode,
        startTime: scannerState.startTime,
        endTime: scannerState.endTime,
        duration: Math.round((scannerState.endTime - scannerState.startTime) / 1000),
        findings: scannerState.findings,
        commands: scannerState.commands,
        statistics: {
            total: scannerState.findings.length,
            confirmed: scannerState.findings.filter(f => f.category === 'confirmed').length,
            potential: scannerState.findings.filter(f => f.category === 'potential').length,
            falsePositives: scannerState.findings.filter(f => f.category === 'false-positive').length
        }
    };

    const json = JSON.stringify(report, null, 2);
    downloadFile(json, `PortHound-Report-${scannerState.target}-${Date.now()}.json`, 'application/json');
}

// Export CSV report
function exportCSVReport() {
    let csv = 'Port,Vulnerability,Severity,CVSS,Confidence,Confirmations,Category,Script\n';
    
    scannerState.findings.forEach(f => {
        csv += `${f.port},"${f.name}",${f.severity},${f.cvss},${f.confidence}%,${f.confirmationCount},${f.category},${f.script}\n`;
    });

    downloadFile(csv, `PortHound-Report-${scannerState.target}-${Date.now()}.csv`, 'text/csv');
}

// Download file helper
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}