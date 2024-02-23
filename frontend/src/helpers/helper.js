export default (searchParams, key, value) => {
    const hasValueInParams = searchParams.has(key);
    if(hasValueInParams && value) {
        searchParams.set(key, value);
    } else if(value) {
        searchParams.append(key, value);
    } else if(hasValueInParams) {
        searchParams.delete(key);
    }
    return searchParams;
};
