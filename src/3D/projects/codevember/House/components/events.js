import {colorsArray, FLOOR_POSITION, FLOOR_SIZE} from "./constants";

export function onMouseMove(e, that){
	if(that.raycaster && that.interectiveMeshes.length){
		that.raycaster.setFromCamera( that.mouse, that.camera );
		const intersects = that.raycaster.intersectObjects([...that.interectiveMeshes, that.flyingText.plane, that.flyingText2.plane]);
		if(intersects[0] && intersects[0].object.name && that.state.loaded){
			that.cssRenderer.renderer.domElement.style.cursor = "pointer";
			that.aimedObjectName = intersects[0].object.name;
		} else {
			that.cssRenderer.renderer.domElement.style.cursor = "auto";
			that.aimedObjectName = ""
		}
	}
}

export async function onKeydown(e, that) {
	if(Object.keys(that.floors).length){
		switch (e.keyCode){
			case 38: {
				that.additinalFloor++;
				that.floors["House_Middle"].mesh.position.y = FLOOR_POSITION.middle + FLOOR_SIZE.middle * (that.additinalFloor);
				that.floors["House_Top"].mesh.position.y = FLOOR_SIZE.top + FLOOR_SIZE.middle * (that.additinalFloor + 1);
				that.interectiveMeshes[2].position.y = FLOOR_SIZE.middle * (that.additinalFloor) * 0.1;
				that.flyingText2.positionY = 150 + FLOOR_SIZE.middle * (that.additinalFloor) * 0.1;
				if (that.additinalFloor === 0){
					that.floors["House_Top"].mesh.position.y = FLOOR_POSITION.top;
					that.interectiveMeshes[2].position.y = FLOOR_POSITION.base;
					that.floors["House_Middle"].mesh.visible = true;
				} else {
					const clonedFloor = that.floors["House_Middle"].mesh.clone();
					that.additinalFloorArray[that.additinalFloor - 1] = clonedFloor;
					clonedFloor.position.y = FLOOR_POSITION.middle + FLOOR_SIZE.middle * (that.additinalFloor -1);
					that.house.add(clonedFloor);
				}
				break
			}
			case 40:{
				that.additinalFloor--;
				if(that.additinalFloor === -1) {
					that.floors["House_Middle"].mesh.visible = false;
					that.floors["House_Top"].mesh.position.y = FLOOR_SIZE.top;
				} else if (that.additinalFloor > -1) {
					that.floors["House_Top"].mesh.position.y = FLOOR_SIZE.top + FLOOR_SIZE.middle * (that.additinalFloor + 1);

				} else {
					that.additinalFloor = -1;
					break;
				}
				that.interectiveMeshes[2].position.y = FLOOR_SIZE.middle * (that.additinalFloor) * 0.1;
				that.flyingText2.positionY = 150 + FLOOR_SIZE.middle * (that.additinalFloor) * 0.1
				const clonedFloor = that.additinalFloorArray[that.additinalFloor + 1] ;
				await that.house.remove(clonedFloor);
				that.floors["House_Middle"].mesh.position.y = FLOOR_POSITION.middle + FLOOR_SIZE.middle * (that.additinalFloor);
				await that.additinalFloorArray.splice(that.additinalFloor + 1, 1);
				break
			}
		}
	}
}

export function onClick(that) {
	if(that.aimedObjectName === "green" && that.state.loaded){
		that.currentColor.index = that.currentColor.index > 1 ? 0 : (that.currentColor.index + 1);
		that.changeLight(colorsArray[that.currentColor.index]);
	}
	if(that.aimedObjectName === "blue" && that.state.loaded){
		if(that.flyingText.show) {
			that.scene.remove(that.flyingText.plane);
			that.cssScene.remove(that.flyingText.cssObject);
			that.flyingText.show = false;
		} else {
			that.scene.add(that.flyingText.plane);
			that.cssScene.add(that.flyingText.cssObject);
			that.flyingText.show = true;
		}
	}
	if(that.aimedObjectName === "red" && that.state.loaded){
		if(that.flyingText2.show) {
			that.scene.remove(that.flyingText2.plane);
			that.cssScene.remove(that.flyingText2.cssObject);
			that.flyingText2.show = false;
		} else {
			that.scene.add(that.flyingText2.plane);
			that.cssScene.add(that.flyingText2.cssObject);
			that.flyingText2.show = true;
		}
	}
}
