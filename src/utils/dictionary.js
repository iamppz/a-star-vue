function formatDictionary(list, dictionary) {
    for (const key in dictionary) {
        if (dictionary.hasOwnProperty(key)) {
            const items = dictionary[key];
            let strings = key.split('.');
            const prop = strings[0];
            let displayMemberPath = strings.length > 2 ? strings[2] : 'name';
            list.forEach(fee => {
                fee[prop + displayMemberPath] = (items.find(item => {
                    return item.value === fee[prop];
                }) || {}).text;
            });
        }
    }
}

export {formatDictionary};
