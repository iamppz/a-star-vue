import _ from 'lodash';

const pathing = node => {
    let func = (paths, basePath, transition) => {
        basePath.push(transition.to);
        // 基础路径
        const basePathMirror = JSON.parse(JSON.stringify(basePath));
        if (transition.to.transitions.length > 0) {
            for (let i = 0; i < transition.to.transitions.length; i++) {
                let next = transition.to.transitions[i];
                let currentPath;
                if (i > 0) {
                    // 从第二条路径起，需要重新克隆基础路径，并添加进路径结果集
                    currentPath = JSON.parse(JSON.stringify(basePathMirror));
                    paths.push(currentPath);
                } else {
                    currentPath = basePath;
                }
                func(paths, currentPath, next);
            }
        }
    };

    const result = node.transitions.map(transition => {
        let path = [transition.from];
        let paths = [path];
        func(paths, path, transition);
        return paths;
    });
    console.log(_.flatten(result).map(path => path.map(node => node.id)));
    return _.flatten(result);
};

export {pathing};