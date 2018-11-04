package uk.co.staticvoid.iothunt.helper;

import org.junit.Test;

import static org.powermock.api.mockito.PowerMockito.mock;

public class RequestHelperTest {

    BukkitHelper bukkitHelper = mock(BukkitHelper.class);
    RequestHelper requestHelper = new RequestHelper(bukkitHelper);

    @Test
    public void shouldCallApiWhenButtonPressed() throws Exception {
//        requestHelper.pushButton("9", "MajorSlackmore");
    }
}