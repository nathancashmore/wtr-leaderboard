package uk.co.staticvoid.iothunt.helper;

import org.bukkit.entity.Player;

import java.net.HttpURLConnection;
import java.net.URL;

public class RequestHelper {

    private static final String URL = "http://iot-hunt.herokuapp.com/buttons/";

    private final BukkitHelper bukkitHelper;

    public RequestHelper(BukkitHelper bukkitHelper) {
        this.bukkitHelper = bukkitHelper;
    }

    public void pushButton(String buttonNumber) throws Exception {

        URL url = new URL(URL + buttonNumber);
        HttpURLConnection con = (HttpURLConnection) url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");

        int responseCode = con.getResponseCode();

        if (responseCode == 200) {
            bukkitHelper.broadcastMessage("Congratulations!", "Button number " + buttonNumber + " has just been pressed");
        } else {
            bukkitHelper.broadcastMessage("DOWT", "You pressed it but something went wrong :-(");
        }
    }
}
