function Trading212() {
    const actionsDone = [];

    function addActions(actions) {
        actionsDone.push(...actions);
    }

    return { addActions };
}

export { Trading212 };
