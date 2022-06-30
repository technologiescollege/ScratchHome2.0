package src.com.ScratchHome;

import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.net.UnknownHostException;

import com.eteks.sweethome3d.model.HomePieceOfFurniture;
import com.eteks.sweethome3d.model.Selectable;
import com.eteks.sweethome3d.swing.HomeComponent3D;

public class ClickListener implements MouseListener {
	
	@Override
	public void mouseClicked(MouseEvent e) {
		// TODO Auto-generated method stub
		System.out.println("mouse is clicked");
		int x=e.getX();
	    int y=e.getY();
	    HomeComponent3D comp = (HomeComponent3D) e.getSource();
	    Selectable closetSelectable = comp.getClosestItemAt(x,y);
	    if (closetSelectable instanceof HomePieceOfFurniture) {
	    	HomePieceOfFurniture piece = (HomePieceOfFurniture) closetSelectable;
		    System.out.println("closet piece : " +piece.getName());
		    try {
				Socket masocket = new Socket("localhost",2022);
				DataOutputStream out= new DataOutputStream(masocket.getOutputStream()); 
				out.writeUTF("click/"+piece.getName()+"("+piece.getDescription()+")");
				masocket.close();
				
			} catch (UnknownHostException ex) {
				// TODO Auto-generated catch block
				ex.printStackTrace();
			} catch (IOException ex) {
				// TODO Auto-generated catch block
				ex.printStackTrace();
			}	
	    }
	}

	@Override
	public void mousePressed(MouseEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void mouseReleased(MouseEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void mouseEntered(MouseEvent e) {
		// TODO Auto-generated method stub

	}

	@Override
	public void mouseExited(MouseEvent e) {
		// TODO Auto-generated method stub

	}

}
