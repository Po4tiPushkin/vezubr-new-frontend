export function formattedDataOperationTimeForClient(values) {
  const data = { ...values };

  Object.entries(data).forEach(([keyI, valueI]) => {
    Object.entries(valueI).forEach(([keyJ, valueJ]) => {
      data[keyI][keyJ] = valueJ / 60;
    });
  });

  return data;
}

export function unFormattedDataOperationTimeForClient(values) {
  const data = { ...values };

  Object.entries(data).forEach(([keyI, valueI]) => {
    Object.entries(valueI).forEach(([keyJ, valueJ]) => {
      data[keyI][keyJ] = valueJ * 60;
    });
  });

  return data;
}
