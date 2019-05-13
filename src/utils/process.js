import _ from 'lodash';

/**
 * 分支需计算出汇合点，将汇合点传递给分支中的节点
 * 以便在递归到该节点时，停止继续向下渲染
 * @returns 分支汇合点
 */
const getIntersection = (transitions) => {
    // 对分支中的路径进行采样
    let paths = [];
    for (let i = 0; i < 2; i++) {
        let transition = transitions[i],
            path = [];
        while (transition) {
            path.push(transition.destination);
            transition = transition.destination.transitions.length > 0 ? transition.destination.transitions[0] : null;
        }
        paths.push(path);
    }

    // 两条路径中最早同时出现的节点即为汇合点
    // 如 1, 2, 3, 5 和 1, 3, 5，则 3 为汇合点
    return paths[0].find(t => {
        let find = paths[1].find(r => r.id === t.id);
        return find !== undefined && find !== null;
    });
};

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

export {pathing, getIntersection};