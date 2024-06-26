using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public Task<Group> GetGroupForConnection(string connectionId)
        {
            return context.Groups
                    .Include(c=>c.Connections)
                    .Where(c=>c.Connections.Any(x=>x.ConnectionId == connectionId))
                    .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages
                    .Include(x=>x.Recipient)
                    .Include(x=>x.Sender)
                    .SingleOrDefaultAsync(m => m.Id == id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await context.Groups
                    .Include(x=>x.Connections).FirstOrDefaultAsync(x=>x.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = context.Messages
            .OrderByDescending(m => m.MessageSent)
            .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
            .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u=>u.RecipientUsername == messageParams.Username
                 && u.RecipientDeleted==false),
                "Outbox" => query.Where(u=>u.SenderUsername == messageParams.Username 
                && u.SenderDeleted == false),
                _ => query.Where(u=>u.RecipientUsername == messageParams.Username
                && u.RecipientDeleted == false && u.DateRead == null)
            }; 

            return await PagedList<MessageDto>.CreateAsync(query, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string RecipientUsername)
        {
            var messages = await context.Messages
                .Where(m => m.Recipient.UserName == currentUsername && m.RecipientDeleted == false
                 && m.Sender.UserName == RecipientUsername
                || m.Recipient.UserName == RecipientUsername
                 && m.Sender.UserName == currentUsername && m.SenderDeleted == false)
                 .OrderBy(m => m.MessageSent)
                 .ProjectTo<MessageDto>(mapper.ConfigurationProvider)
                 .ToListAsync();

            var unreadMessages = messages.Where(m => m.DateRead == null && m.RecipientUsername == currentUsername).ToList();

            if(unreadMessages.Any())
            {
                foreach(var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
                
                await context.SaveChangesAsync();
            }

            return messages;
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }

        public async Task<bool> SaveAllAsinc()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}   