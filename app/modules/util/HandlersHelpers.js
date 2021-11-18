export function save_UI_Entries(saveMethod, ...entries) {
    saveMethod(entries);
}

export function limitNumericalEntry(limit, mode) {
    if (mode == 'max') {
        if (this.value > limit) { this.value = limit; }
    }
}