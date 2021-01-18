export function ordenarPtBr (lista, campo) {
  const list = lista.sort((a, b) => {
    a = a[campo].toUpperCase()
    b = b[campo].toUpperCase()
    a = a.replace(/[AÀÁÂÃÄÅ]/, 'A')
    a = a.replace(/[EÈÉÊË]/, 'E')
    a = a.replace(/[IÍ]/, 'I')
    a = a.replace(/[OÓÔÕ]/, 'O')
    a = a.replace(/[CÇ]/, 'C')
    a = a.replace(/[UÚ]/, 'U')
    b = b.replace(/[AÀÁÂÃÄÅ]/, 'A')
    b = b.replace(/[EÈÉÊË]/, 'E')
    b = b.replace(/[IÍ]/, 'I')
    b = b.replace(/[OÓÔÕ]/, 'O')
    b = b.replace(/[CÇ]/, 'C')
    b = b.replace(/[UÚ]/, 'U')
    a.replace(/[^a-z0-9]/gi, '')
    b.replace(/[^a-z0-9]/gi, '')
    if (a > b) {
      return 1
    }
    if (a < b) {
      return -1
    }
    return 0
  })
  return list
}
