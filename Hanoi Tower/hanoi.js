var controllerAlgorithm = (function () {
    let elements, sourceTower, targetTower, hanoiArray;
    elements = 3;
    sourceTower = 1;
    targetTower = 3
    hanoiArray = [];

    const towers = 3;

    let HanoiBlock = function (id, weight) {
        this.blockID = id;
        this.weight = weight;
    };

    let Tower = function (id) {
        this.id = id;
        this.blocks = [];
        this.getFirstBlock = function () { return this.blocks[0]; }
    }

    const createBlocks = () => {
        for (var i = 1; i <= elements; i++)
            getTower(sourceTower).blocks.push(new HanoiBlock('block' + i, i));
    }

    const getTower = id => {
        return hanoiArray.find(tower => tower.id == id);
    }

    return {
        setElements: function (n) {
            this.elements = n;
        },

        setSourceTower: n => {
            this.sourceTower = n;
        },

        setTargetTower: n => {
            this.targetTower = n;
        },

        setCountOfTowers: n => {
            this.towers = 3;
        },

        createBlocks: () => {
            return createBlocks();
        },

        getHanoiArray: () => {
            return hanoiArray;
        },

        createTowers: () => {
            for (let i = 1; i <= towers; i++)
                hanoiArray.push(new Tower(i))
        },

        getTower: (towerId) => {
            return hanoiArray.find(tower => tower.id == towerId);
        },

        moveBlock: (sourceTower, targetTower) => {
            let block = sourceTower.getFirstBlock();
            let target = targetTower.getFirstBlock();

            if (!block) return false;

            if (block && target) {
                if (block.weight < target.weight) {
                    sourceTower.blocks.shift();
                    targetTower.blocks.unshift(block)

                    console.log(`FROM TOWER:${sourceTower.id} BLOCK:${block.weight} TO TARGET:${targetTower.id}`);
                    return true;
                }
            }
            else if (block && !target) {
                sourceTower.blocks.shift();
                targetTower.blocks.unshift(block)

                console.log(`FROM TOWER:${sourceTower.id} BLOCK:${block.weight} TO TARGET:${targetTower.id}`);
                return true;
            }

            return false;
        },
    }
})();

var controllerUI = (function () {
    var towers = [1, 2, 3];
    var DOM = {
        tower: ".tower",
        towerID: ".towerID-",
        mainContainer: ".hanoi",
    }

    function sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    return {

        printTowers: function (hanoiArray) {
            var html = '';
            let hanoiContainer = document.querySelector(".hanoi");
            hanoiContainer.querySelectorAll('*').forEach(child => child.remove());

            hanoiArray.forEach(tower => {
                hanoiContainer.insertAdjacentHTML("beforeend", "<div id='" + tower.id + "' class='tower towerID-" + tower.id + "'></div>")
            })

            hanoiArray.forEach(tower => tower.blocks.forEach(block => {
                html = " <div id='" + block.weight + "' class='block' style='height: 50px; width: " + block.weight * 10 + "%; background-color: #FF2D00; margin: 20px; '><p>" + block.weight + "</p></div>";
                document.querySelector(DOM.towerID + tower.id).insertAdjacentHTML("beforeend", html)
            }));

            sleep(2000);
        },

        getDOM: function () {
            return DOM;
        },

        testing: function () {
            console.log('controller UI');
        }
    }
})();

var globalController = (function (uiController, algorithmController) {

    var iteration = 0;

    const blockCount = 3;
    const towersCount = 3;
    const sourceTower = 1;
    const targetTower = 3;

    const runAlgorithm = () => {

        uiController.printTowers(algorithmController.getHanoiArray());
        moveBlocksToTarget(blockCount - 1, algorithmController.getTower(1), algorithmController.getTower(2), algorithmController.getTower(3));

        console.log(iteration)
    }

    const moveBlocksToTarget = (block, sourceTower, bufforTower, targetTower) => {
        if (sourceTower.blocks[block]) {

            moveBlocksToTarget(block - 1, sourceTower, targetTower, bufforTower);

            algorithmController.moveBlock(sourceTower, targetTower) ? iteration++ : null;
            uiController.printTowers(algorithmController.getHanoiArray());

            moveBlocksToTarget(block - 1, bufforTower, sourceTower, targetTower);
        }
    }

    return {
        start: () => {
            algorithmController.setElements(3);
            algorithmController.setCountOfTowers(3);
            algorithmController.setSourceTower(1);
            algorithmController.setTargetTower(3);
            algorithmController.createTowers();
            algorithmController.createBlocks();

            runAlgorithm();
        }
    }
})(controllerUI, controllerAlgorithm);

globalController.start();