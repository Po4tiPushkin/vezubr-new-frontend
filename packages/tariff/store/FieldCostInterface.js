export default class FieldCostInterface {
  get error() {
    throw new Error('Mast override');
  }

  setCost(cost) {
    throw new Error('Mast override');
  }

  get cost() {
    throw new Error('Mast override');
  }
}
