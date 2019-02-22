import Loadable from 'react-loadable'

const lazy = (loadFunc) => {
  return Loadable({
    loader: loadFunc,
    loading: () => null
  });
};

export default lazy