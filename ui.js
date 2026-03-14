// PortHound - UI Helper Functions

// Toggle advanced options
function toggleAdvanced() {
    const panel = document.getElementById('advancedPanel');
    const button = document.querySelector('.toggle-advanced');
    
    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        button.classList.remove('active');
    } else {
        panel.classList.add('open');
        button.classList.add('active');
    }
}

// Update progress bar
function updateProgress(percentage, phaseText) {
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const currentPhase = document.getElementById('currentPhase');
    
    progressBar.style.width = percentage + '%';
    progressText.textContent = Math.round(percentage) + '%';
    currentPhase.textContent = phaseText;
}

// Create phase cards
function createPhaseCards(phases) {
    const container = document.getElementById('scanPhases');
    container.innerHTML = '';
    
    phases.forEach((phase, index) => {
        const card = document.createElement('div');
        card.className = 'phase-card';
        card.id = `phase-${index}`;
        card.innerHTML = `
            <div class="phase-name">${phase.name}</div>
            <div class="phase-status">Pending</div>
        `;
        container.appendChild(card);
    });
}

// Update phase status
function updatePhaseStatus(phaseIndex, status) {
    const card = document.getElementById(`phase-${phaseIndex}`);
    if (!card) return;
    
    const statusElement = card.querySelector('.phase-status');
    
    // Remove all status classes
    card.classList.remove('active', 'completed', 'failed');
    
    // Add new status class
    card.classList.add(status);
    
    // Update status text
    if (status === 'active') {
        statusElement.textContent = 'Running...';
    } else if (status === 'completed') {
        statusElement.textContent = '✓ Completed';
    } else if (status === 'failed') {
        statusElement.textContent = '✗ Failed';
    }
}

// Add terminal output
function addTerminalOutput(text, type = 'normal') {
    const terminal = document.getElementById('terminal');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    
    if (type === 'error') {
        line.classList.add('error');
        text = '[ERROR] ' + text;
    } else if (type === 'success') {
        line.classList.add('success');
        text = '[✓] ' + text;
    } else if (type === 'warning') {
        line.classList.add('warning');
        text = '[!] ' + text;
    }
    
    const timestamp = new Date().toLocaleTimeString();
    line.textContent = `[${timestamp}] ${text}`;
    
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
}

// Clear terminal output
function clearOutput() {
    const terminal = document.getElementById('terminal');
    terminal.innerHTML = '<div class="terminal-line">$ Terminal cleared...</div>';
}

// Show notification (simple alert - could be enhanced with toast)
function showNotification(message, type = 'info') {
    // You could implement a custom toast notification here
    // For now, using browser alert
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    alert(`${icon} ${message}`);
}

// Format timestamp
function formatTimestamp(date) {
    return new Date(date).toLocaleString();
}

// Format duration
function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Smooth scroll to element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Validate target input
function validateTarget(target) {
    // Simple validation for IP or domain
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\.[a-zA-Z]{2,})+$/;
    
    if (ipRegex.test(target)) {
        // Validate IP octets
        const octets = target.split('.');
        return octets.every(octet => parseInt(octet) >= 0 && parseInt(octet) <= 255);
    }
    
    return domainRegex.test(target);
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(err => {
            showNotification('Failed to copy', 'error');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('Copied to clipboard!', 'success');
    }
}

// Get severity color
function getSeverityColor(severity) {
    const colors = {
        critical: '#dc3545',
        high: '#fd7e14',
        medium: '#ffc107',
        low: '#17a2b8',
        info: '#10b981'
    };
    return colors[severity] || '#6b7280';
}

// Get confidence level text
function getConfidenceLevel(confidence) {
    if (confidence >= 90) return 'Very High';
    if (confidence >= 75) return 'High';
    if (confidence >= 60) return 'Medium';
    if (confidence >= 40) return 'Low';
    return 'Very Low';
}

// Format port list
function formatPortList(ports) {
    if (ports.length === 0) return 'None';
    if (ports.length <= 5) return ports.join(', ');
    return ports.slice(0, 5).join(', ') + ` +${ports.length - 5} more`;
}

// Generate random ID
function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Local storage helpers
const storage = {
    save: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage save error:', e);
            return false;
        }
    },
    
    load: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage load error:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }
};

// Save scan history
function saveScanToHistory() {
    const history = storage.load('scanHistory') || [];
    
    const scanRecord = {
        id: generateId(),
        target: scannerState.target,
        mode: scannerState.mode,
        timestamp: scannerState.startTime,
        duration: scannerState.endTime - scannerState.startTime,
        findingsCount: scannerState.findings.length,
        confirmedCount: scannerState.findings.filter(f => f.category === 'confirmed').length
    };
    
    history.unshift(scanRecord);
    
    // Keep only last 10 scans
    if (history.length > 10) {
        history.pop();
    }
    
    storage.save('scanHistory', history);
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Target input validation
    const targetInput = document.getElementById('target');
    if (targetInput) {
        targetInput.addEventListener('blur', function() {
            const target = this.value.trim();
            if (target && !validateTarget(target)) {
                showNotification('Please enter a valid IP address or domain name', 'warning');
            }
        });
    }
    
    // Save history when scan completes
    window.addEventListener('scanComplete', function() {
        saveScanToHistory();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to start scan
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            startScan();
        }
        
        // Escape to stop scan (if implemented)
        if (e.key === 'Escape' && scannerState.isScanning) {
            // Implement stop scan functionality if needed
        }
    });
});

// Export functions for use in other modules
window.PortHoundUI = {
    toggleAdvanced,
    updateProgress,
    createPhaseCards,
    updatePhaseStatus,
    addTerminalOutput,
    clearOutput,
    showNotification,
    validateTarget,
    copyToClipboard,
    getSeverityColor,
    getConfidenceLevel,
    formatPortList,
    saveScanToHistory
};