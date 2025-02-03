// Default emergency contacts
const defaultIndianContacts = [
{
    name: "National Emergency Number",
    phone: "112",
    relation: "Emergency Services"
},
{
    name: "COVID-19 Helpline",
    phone: "1075",
    relation: "Health Services"
},
{
    name: "Ambulance",
    phone: "108",
    relation: "Medical Emergency"
},
{
    name: "Police",
    phone: "100",
    relation: "Law Enforcement"
},
{
    name: "Fire",
    phone: "101",
    relation: "Fire Emergency"
},
{
    name: "Women Helpline",
    phone: "1091",
    relation: "Women Safety"
}
];

function initializeDefaultContacts() {
if (!localStorage.getItem('emergencyContacts')) {
    localStorage.setItem('emergencyContacts', JSON.stringify(defaultIndianContacts));
}
}

// Initialize page
window.onload = () => {
initializeDefaultContacts(); // Add this line first
initChecklist();
updateContactsList();
loadProtocols();
};

// Gemini API Key
const API_KEY = 'AIzaSyAP5Wdm2CiiGZymRnxzEokkXJQ7ZnlFa5w';

// Load checklist items from localStorage
const checklistItems = JSON.parse(localStorage.getItem('checklistItems')) || [
    'Stock up on essential medicines',
    'Prepare emergency food supplies',
    'Create an emergency communication plan',
    'Keep sanitization supplies ready'
];

// Load emergency contacts from localStorage
const emergencyContacts = JSON.parse(localStorage.getItem('emergencyContacts')) || [];

// Initialize checklist
function initChecklist() {
    const container = document.getElementById('checklistItems');
    container.innerHTML = checklistItems.map((item, index) => `
        <div class="checklist-item">
            <input type="checkbox" id="item${index}">
            <label for="item${index}">${item}</label>
        </div>
    `).join('');
}

// Add new checklist item
function addChecklistItem() {
    const item = prompt('Enter new checklist item:');
    if (item) {
        checklistItems.push(item);
        localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
        initChecklist();
    }
}

// Check symptoms using Gemini API
async function checkSymptoms(event) {
    event.preventDefault();
    const symptoms = event.target.querySelector('textarea').value;
    const resultDiv = document.getElementById('symptomsResult');
    
    resultDiv.innerHTML = '<p>Analyzing symptoms...</p>';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `As a medical AI assistant, analyze these symptoms and provide potential causes and recommendations: ${symptoms}`
                    }]
                }]
            })
        });

        const data = await response.json();
        resultDiv.innerHTML = `<div class="protocol-item">${data.candidates[0].content.parts[0].text}</div>`;
    } catch (error) {
        resultDiv.innerHTML = '<p>Error analyzing symptoms. Please try again.</p>';
    }
}

// Add emergency contact
function addContact(event) {
    event.preventDefault();
    const contact = {
        name: document.getElementById('contactName').value,
        phone: document.getElementById('contactPhone').value,
        relation: document.getElementById('contactRelation').value
    };
    emergencyContacts.push(contact);
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    updateContactsList();
    event.target.reset();
}

// Update contacts list
function updateContactsList() {
    const container = document.getElementById('contactsList');
    container.innerHTML = emergencyContacts.map((contact, index) => `
        <div class="contact-card">
            <h3>${contact.name}</h3>
            <p><i class="fas fa-phone"></i> ${contact.phone}</p>
            <p><i class="fas fa-user"></i> ${contact.relation}</p>
            <button class="btn" onclick="deleteContact(${index})">Delete</button>
        </div>
    `).join('');
}

// Delete contact
function deleteContact(index) {
    emergencyContacts.splice(index, 1);
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
    updateContactsList();
}

// Load WHO/CDC protocols
async function loadProtocols() {
    const protocols = [
        'Wear a mask in public settings',
        'Maintain physical distance of at least 6 feet',
        'Wash hands frequently with soap and water',
        'Get vaccinated and stay up to date with boosters',
        'Monitor your health daily'
    ];

    const container = document.getElementById('protocolsList');
    container.innerHTML = protocols.map(protocol => `
        <div class="protocol-item">
            <i class="fas fa-check-circle"></i> ${protocol}
        </div>
    `).join('');
}

// Initialize page
window.onload = () => {
    initChecklist();
    updateContactsList();
    loadProtocols();
};
