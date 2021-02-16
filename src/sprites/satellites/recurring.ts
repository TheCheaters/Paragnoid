
export type Fun<T> = (arr: T) => T[];
/**
 * Prende in carico una funzione di tipo T => [T] e restituisce una funzione ricorsiva
 * che può essere chiamata con un valore iniziale e un numero massimo di iterazioni.
 *
 * esempio:
 * const spezzaNumeroRicorsiva = createRecurringFunction(spezzaNumero);
 * const risultato = spezzaNumeroRicorsiva(20, 2);
 * result [20, 10, 10, 5, 5, 5, 5]
 *
 * @template T
 * @param {Fun<T>} fun
 */
const createRecurringFunction = <T>(fun: Fun<T>, context: unknown) => (startValue: T, limit: number): T[] => {
  const result = [startValue];
  let index = 0;
  let arr = [...result];
  while (index < limit) {
    for (const num of arr) {
      arr = fun.call(context, num);
      result.push(...arr);
    }
    index++
  }
  return result;
}

/**
 * Prende in carico una funzione di tipo T => [T] e restituisce una funzione ricorsiva
 * che può essere chiamata con un valore iniziale e un numero massimo di iterazioni.
 *
 * esempio:
 * const spezzaNumeroRicorsiva = createRecurringFunction(spezzaNumero);
 * const risultato = spezzaNumeroRicorsiva(20, 2);
 * result [5, 5, 5, 5]
 *
 * @template T
 * @param {Fun<T>} fun
 */
const createRecurringFunctionLast = <T>(fun: Fun<T>, context: unknown) => (startValue: T, limit: number): T[] => {
  const result: T[] = [];
  let index = 0;
  let arr = [startValue];
  while (index <= limit) {
    const temp = [startValue];
    for (const num of arr) {
      const newValues = fun.call(context, num);
      temp.push(...newValues);
    }
    temp.splice(0, 1);
    arr = temp;
    if (index === limit) result.push(...arr);
    index++
  }
  return result;
}


export {
  createRecurringFunction,
  createRecurringFunctionLast
};