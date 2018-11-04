package uk.co.staticvoid.iothunt;

import org.bukkit.command.CommandExecutor;
import org.bukkit.configuration.serialization.ConfigurationSerialization;
import org.bukkit.plugin.java.JavaPlugin;
import uk.co.staticvoid.iothunt.helper.BukkitHelper;
import uk.co.staticvoid.iothunt.helper.RequestHelper;

public final class IOTHunt extends JavaPlugin {

    @Override
    public void onEnable() {
        BukkitHelper bukkitHelper = new BukkitHelper();
        RequestHelper requestHelper = new RequestHelper(bukkitHelper);

        CommandExecutor cmdExecutor = new IOTHuntCommandExecutor(this, requestHelper);

        this.getCommand("push-button").setExecutor(cmdExecutor);
    }

    @Override
    public void onDisable() {
        getLogger().info("Has been disabled");
    }
    
}
