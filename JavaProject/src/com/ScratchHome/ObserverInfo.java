package src.com.ScratchHome;

import com.eteks.sweethome3d.model.ObserverCamera;
public class ObserverInfo {
	private float x = 0;
	private float y = 0;
	private float angle = 0;
	private ObserverCamera obs = null;
	
	public ObserverInfo(ObserverCamera obs) {
		this.obs = obs;
	}

	public float getX() {
		this.setInfo();
		return x;
	}

	public float getY() {
		this.setInfo();
		return y;
	}


	public float getAngle() {
		this.setInfo();
		return angle;
	}
	
	private void setInfo() {
		//Adapt x y and angle to match Scratch's View.
		if (obs != null) {
			x = obs.getX()-200*160/250;
			y = obs.getY()-200*360/600;
			angle = (float) (obs.getYaw()*180/Math.PI - 180);
		}
	}

	
	
}
