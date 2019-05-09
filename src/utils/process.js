import _ from 'lodash';

const pathing = node => {
    let func = (paths, basePath, transition) => {
        basePath.push(transition.destination);
        // 基础路径
        const basePathMirror = [...basePath];
        if (transition.destination.transitions.length > 0) {
            for (let i = 0; i < transition.destination.transitions.length; i++) {
                let nextTransition = transition.destination.transitions[i];
                let currentPath;
                if (i > 0) {
                    // 从第二条路径起，需要重新克隆基础路径，并将克隆后的数组添加进路径结果集
                    currentPath = [...basePathMirror];
                    paths.push(currentPath);
                } else {
                    currentPath = basePath;
                }
                func(paths, currentPath, nextTransition);
            }
        }
    };

    const result = node.transitions.map(transition => {
        transition.source = node;
        let path = [transition.source];
        let paths = [path];
        func(paths, path, transition);
        return paths;
    });
    return _.flatten(result);
};

export {pathing};