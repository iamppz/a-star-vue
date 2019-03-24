function formatMoney(number) {
    return number.toLocaleString(undefined, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    })
}

export {formatMoney}