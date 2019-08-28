/* @flow */

import * as React from 'react';

class SceneComponent extends React.PureComponent<*> {
  render() {
    const { component, ...rest } = this.props;
    return React.createElement(component, rest);
  }
}
// export default function SceneMap<T: *>(data) {
//   alert(JSON.stringify(data))
//   return ;
// }
export default function SceneMap<T: *>(scenes: {
  [key: string]: React.ComponentType<T>
}) {

  // alert("123dddds"+JSON.stringify(scenes))

  return ({ route, jumpTo, navigation,setTitleNumber }: T) => {
    
    // alert("dsacas"+JSON.stringify(route.key));
    return <SceneComponent
        key={route.key}
        component={scenes[route.key]}
        navigation={navigation}
        route={route}
        jumpTo={jumpTo}
        setTitleNumber={setTitleNumber}
      />
  }
  // (
  //   <SceneComponent
  //     key={route.key}
  //     component={scenes[route.key]}
  //     navigation={navigation}
  //     route={route}
  //     jumpTo={jumpTo}
  //     setTitleNumber={setTitleNumber}
  //   />
  // );
}
