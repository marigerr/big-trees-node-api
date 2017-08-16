function storageAvailable(type) {
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

function addToLocalStorage(key, value) {
  console.log('adding to local storage');
  localStorage.setItem(key, JSON.stringify(value));
}

function getFromLocalStorage(key) {
  console.log('get from Local Storage');
  return JSON.parse(localStorage.getItem(key));
}

function localStorageKeyExists(key) {
  return localStorage.getItem(key) !== null;
}

export { localStorageKeyExists, addToLocalStorage, getFromLocalStorage, storageAvailable };
