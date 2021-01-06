export function tipoArr (t, v) {
  let valor = 0
  switch (t) {
    case '0': valor = v
      break
    case '1': valor = centavos(v)
      break
    case '2': valor = cinco(v)
      break
    case '3': valor = cincomais(v)
      break
    case '4': valor = dez(v)
      break
    case '5': valor = dezmais(v)
  }
  return valor

  function centavos (v) {
    // const int = Math.round(v)
    return parseInt(v)
  }

  function cinco (v) {
    const x = v / 5
    const y = Math.round(x)
    const int = y * 5
    return int
  }

  function dez (v) {
    const x = v / 10
    const y = Math.round(x)
    const int = y * 10
    return int
  }

  function cincomais (v) {
    const x = v / 5
    const y = Math.round(x)
    let int = y * 5
    if (v > int) { int += 5 }
    return int
  }

  function dezmais (v) {
    const x = v / 10
    const y = Math.ceil(x)
    let int = y * 10
    if (v > int) { int += 10 }
    return int
  }
}
