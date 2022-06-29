package src.com.ScratchHome;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;

import com.eteks.sweethome3d.model.Camera;
import com.eteks.sweethome3d.model.ObserverCamera;

public class CameraListener implements PropertyChangeListener {

	@Override
	public void propertyChange(PropertyChangeEvent evt) {
		// TODO Auto-generated method stub
		Camera newCam = (Camera) evt.getNewValue();
		if (newCam instanceof ObserverCamera) {
			System.out.println("there is an observer camera added");
			newCam.addPropertyChangeListener(new PositionCameraListener());
			
		}
	}

}
