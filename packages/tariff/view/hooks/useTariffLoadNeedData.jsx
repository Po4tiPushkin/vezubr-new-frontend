import React from 'react';
import { Common as CommonService } from '@vezubr/services';
import { showError } from '@vezubr/elements';

export default function (props) {
  const [loading, setLoading] = React.useState(false);

  const [data, setData] = React.useState({});

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const producers = (await CommonService.counterPartiesList(1)) || [];
        setData({
          producers,
        });
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return [data, loading];
}
