
namespace API.SignalR
{
    public class PresenceTracker
    {
        private static readonly Dictionary<string, List<string>> OnlinUsers =
         new Dictionary<string, List<string>>();

        public Task<bool> UserConnected(string username, string connectionId)
        {
            bool isOnline = false;
            lock(OnlinUsers)
            {
                if(OnlinUsers.ContainsKey(username))
                {
                    OnlinUsers[username].Add(connectionId);
                } else{
                    OnlinUsers.Add(username, new List<string>{connectionId});
                    isOnline = true;
                }
            }

            return Task.FromResult(isOnline);
        }

        public Task<bool> UserDisconnected(string username, string connectionId)
        {
            bool isOffline = false;
            lock(OnlinUsers)
            {
                if(!OnlinUsers.ContainsKey(username)) return Task.FromResult(isOffline);

                OnlinUsers[username].Remove(connectionId);
                if(OnlinUsers[username].Count() == 0)
                {
                    OnlinUsers.Remove(username);
                    isOffline = true;
                }
            }

            return Task.FromResult(isOffline);
        }

        public Task<string[]> GetOnlineUsers()
        {
            string[] onlineUsers;
            
            lock(OnlinUsers)
            {
                onlineUsers = OnlinUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
            }

            return Task.FromResult(onlineUsers);
        } 

        public Task<List<string>> GetConnectionsForUser(string username)
        {
            List<string> conncationIds;

            lock(OnlinUsers)
            {
                conncationIds = OnlinUsers.GetValueOrDefault(username);
            }

            return Task.FromResult(conncationIds);
        }
    }
}