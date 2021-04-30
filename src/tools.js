export function generateColor() {
    let colorHex = '#'
    while ( colorHex.length < 7 ) {
        colorHex += (Math.round(Math.random() * 15)).toString(16)
    }
    return colorHex
}