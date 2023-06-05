import { useContext } from 'react';
import { CargoPlaceSelectContext } from './context';

const SelectTemplate = (props) => {
  const { children } = props;
  const context = useContext(CargoPlaceSelectContext);

  return children(context);
}

export default SelectTemplate;