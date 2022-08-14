//db connection
let db;

// establish db connection
const request = indexedDB.open('budget_track', 1);


// event listener for database version change
request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore('new_budget', {autoIncrement: true})
}

//save data on successful
request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.online) { 
        uploadBudget();  
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode)
}

// function to save budget with no internet
function saveRecord(record) {
    const transaction = db.transaction(['new_budget'], 'readwrite');
  
    const budgetObjectStore = transaction.objectStore('new_budget');
  
    budgetObjectStore.add(record);
  }

  function uploadBudget() {

    const transaction = db.transaction(['new_budget'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_budget');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(['new_budget'], 'readwrite');

                    const budgetObjectStore = transaction.objectStore('new_budget');

                    budgetObjectStore.clear();

                    alert('transaction submitted');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}

window.addEventListener('online', uploadBudget);