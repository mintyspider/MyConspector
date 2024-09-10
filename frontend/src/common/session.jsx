export const storeInSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}

export const lookInSession = (keys) => {
    return sessionStorage.getItem(keys);
}

export const removeFromSession = (ke) => {
    return sessionStorage.removeItem(ke);
}