package src.com.ScratchHome;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

import com.eteks.sweethome3d.model.ObserverCamera;

public class PositionCameraListener implements PropertyChangeListener {

	@Override
	public void propertyChange(PropertyChangeEvent evt) {
		// TODO Auto-generated method stub
		String property = evt.getPropertyName();
		ObserverCamera obs = (ObserverCamera) evt.getSource();
		Object newValue = evt.getNewValue();
		
		float x = obs.getX();
		float y = obs.getY();
		float angle = obs.getYaw();
		
		if (property.equals("X")) {
			x = (Float) newValue;
		}else if (property.equals("Y")) {
			y = (Float) newValue;
		}else if (property.equals("YAW")) {
			angle = (Float) newValue;
		}
		try {
			Socket masocket = new Socket("localhost",2022);
			DataOutputStream out= new DataOutputStream(masocket.getOutputStream()); 
			out.writeUTF("position/"+x+"/"+y+"/"+angle);
			masocket.close();
			
		} catch (UnknownHostException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}	
	}

}
