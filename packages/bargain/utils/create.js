export function createOfferListFromMinMy(min, my, selfProducer) {
  const list = [];
  if (min) {
    const minItem = { ...min };
    if (min.id === my?.id) {
      minItem['producer'] = selfProducer;
    }
    list.push(minItem);
  }

  if (my && min?.id !== my.id) {
    list.push({ ...my, producer: selfProducer });
  }

  return list;
}
