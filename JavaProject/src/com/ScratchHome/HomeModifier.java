package src.com.ScratchHome;

import com.eteks.sweethome3d.model.Home;
import com.eteks.sweethome3d.model.HomePieceOfFurniture;

/**
 *  
 *Modify SH3D objects properties (only the colors for the moment but can be improved)
 *
 */
public class HomeModifier {
	public static void changeColor(String hash, int color, Home home) {
		for (HomePieceOfFurniture fourniture : home.getFurniture()) {
			
			if(fourniture.getDescription() != null)
				if(fourniture.getDescription().equals(hash)) {
					try {
						fourniture.setColor(color);
					}catch(java.lang.IllegalStateException e) {
						ScratchListener.sendResponse("Object is not able to be colored");
					}
				}
					
		}
	}
}