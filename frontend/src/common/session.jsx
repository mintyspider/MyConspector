export const storeInSession = (key, value) => {
    sessionStorage.setItem(key, value);
}

export const lookInSession = (key) => {
    sessionStorage.getItem(key);
}

export const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}