package uk.co.staticvoid.iothunt;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.api.mockito.PowerMockito;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import uk.co.staticvoid.iothunt.helper.RequestHelper;

import java.util.logging.Logger;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@RunWith(PowerMockRunner.class)
@PrepareForTest({IOTHunt.class})
public class IOTHuntCommandExecutorTest {

    private IOTHunt plugin = PowerMockito.mock(IOTHunt.class);
    private Logger logger = mock(Logger.class);

    private Player player = mock(Player.class);
    private CommandSender commandSender = mock(CommandSender.class);

    private Command command = mock(Command.class);
    private RequestHelper requestHelper = mock(RequestHelper.class);

    private IOTHuntCommandExecutor underTest = new IOTHuntCommandExecutor(plugin, requestHelper);

    @Before
    public void setup() {
        when(plugin.getLogger()).thenReturn(logger);
    }

    @Test
    public void shouldBeAbleToPushAButton() {
        when(command.getName()).thenReturn("push-button");
        String[] inputArgs = {"1"};

        assertThat(underTest.onCommand(player, command, "", inputArgs), is(true));
    }

    @Test
    public void mustHaveOneArgumentForPushButton() {
        when(command.getName()).thenReturn("push-button");
        String[] inputArgs = {};

        assertThat(underTest.onCommand(commandSender, command, "", inputArgs), is(false));
    }
}