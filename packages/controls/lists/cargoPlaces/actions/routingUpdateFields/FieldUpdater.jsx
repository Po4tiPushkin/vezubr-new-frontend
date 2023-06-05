import { useContext } from 'react';
import { CargoPlaceChangeContext } from './context';

const FieldUpdater = (props) => {
  const { children } = props;
  const context = useContext(CargoPlaceChangeContext);

  return children(context);
}

export default FieldUpdater;