using BankBackendApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BankBackendApp.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<User> user { get; set; }
        public DbSet<Role> role { get; set; }
        public DbSet<Account> account { get; set; }
        public DbSet<Card> card { get; set; }
        public DbSet<Currency> currency { get; set; }
        public DbSet<Transaction> transaction { get; set; }
        public DbSet<TransactionStatus> transaction_status { get; set; }
        public DbSet<Signature> signature { get; set; }
        public DbSet<Deposit> deposit { get; set; }
        public DbSet<DepositType> deposit_type { get; set; }
        public DbSet<CardProvider> card_provider { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USER → ROLE
            modelBuilder.Entity<User>()
                .HasOne(u => u.Role)
                .WithMany(r => r.Users)
                .HasForeignKey(u => u.role_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
                .Property(u => u.birthday)
                .HasColumnType("date");

            // ACCOUNT → USER
            modelBuilder.Entity<Account>()
                .HasOne(a => a.User)
                .WithMany(u => u.Accounts)
                .HasForeignKey(a => a.user_id)
                .OnDelete(DeleteBehavior.Restrict);

            // ACCOUNT → CURRENCY
            modelBuilder.Entity<Account>()
                .HasOne(a => a.Currency)
                .WithMany(c => c.Accounts)
                .HasForeignKey(a => a.currency_id)
                .OnDelete(DeleteBehavior.Restrict);

            // CARD → ACCOUNT
            modelBuilder.Entity<Card>()
                .HasOne(c => c.Account)
                .WithMany(a => a.Cards)
                .HasForeignKey(c => c.account_id)
                .OnDelete(DeleteBehavior.Restrict);

            // CARD → CURRENCY
            modelBuilder.Entity<Card>()
                .HasOne(c => c.Currency)
                .WithMany(cur => cur.Cards)
                .HasForeignKey(c => c.currency_id)
                .OnDelete(DeleteBehavior.Restrict);

            // DEPOSIT → USER
            modelBuilder.Entity<Deposit>()
                .HasOne(d => d.User)
                .WithMany(u => u.Deposits)
                .HasForeignKey(d => d.user_id)
                .OnDelete(DeleteBehavior.Restrict);


            // DEPOSIT → CURRENCY
            modelBuilder.Entity<Deposit>()
                .HasOne(d => d.Currency)
                .WithMany(c => c.Deposits)
                .HasForeignKey(d => d.currency_id)
                .OnDelete(DeleteBehavior.Restrict);

            // DEPOSIT → DEPOSIT TYPE
            modelBuilder.Entity<Deposit>()
                .HasOne(d => d.DepositType)
                .WithMany(dt => dt.Deposits)
                .HasForeignKey(d => d.deposit_type_id)
                .OnDelete(DeleteBehavior.Restrict);

            // TRANSACTION → STATUS
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Status)
                .WithMany(s => s.Transactions)
                .HasForeignKey(t => t.status_id)
                .OnDelete(DeleteBehavior.Restrict);

            // TRANSACTION → SIGNATURE (optional)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Signature)
                .WithMany(s => s.Transactions)
                .HasForeignKey(t => t.signature_id)
                .OnDelete(DeleteBehavior.SetNull);

            // TRANSACTION → ACCOUNT_FROM (self reference)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.AccountFrom)
                .WithMany(a => a.TransactionsFrom)
                .HasForeignKey(t => t.account_from_id)
                .OnDelete(DeleteBehavior.Restrict);

            // TRANSACTION → ACCOUNT_TO (self reference)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.AccountTo)
                .WithMany(a => a.TransactionsTo)
                .HasForeignKey(t => t.account_to_id)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Card>()
                .HasOne(c => c.CardProvider)
                .WithMany(cp => cp.Cards)
                .HasForeignKey(c => c.card_provider_id)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
