package uk.co.staticvoid.iothunt;

import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.plugin.java.JavaPlugin;
import uk.co.staticvoid.iothunt.helper.RequestHelper;

import java.util.logging.Level;

public class IOTHuntCommandExecutor implements CommandExecutor {

    private final JavaPlugin plugin;
    private final RequestHelper requestHelper;

    public IOTHuntCommandExecutor(JavaPlugin plugin, RequestHelper requestHelper) {
        this.plugin = plugin;
        this.requestHelper = requestHelper;
    }

    @Override
    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args) {
        try {
            switch (cmd.getName().toLowerCase()) {
                case "push-button":
                    validateMustHaveOneArgument(args);
                    requestHelper.pushButton(args[0]);
                    return true;
                default:
                    return false;
            }
        } catch (Exception ex) {
            sender.sendMessage(ex.getMessage());
            plugin.getLogger().log(Level.INFO, ex.getMessage());
            return false;
        }
    }

    private void validateMustHaveOneArgument(String[] args) {
        if (args.length != 1) {
            throw new IllegalArgumentException("You need more parameters for that command");
        }
    }


}
