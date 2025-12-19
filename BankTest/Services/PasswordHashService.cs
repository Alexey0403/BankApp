using BankBackendApp.Interfaces;
using System;
using System.Text;

namespace BankBackendApp.Services
{
    public class PasswordHashService : IPasswordHashService
    {
        private readonly string _pepper;

        public PasswordHashService(IConfiguration configuration)
        {
            _pepper = configuration["Security:PASSWORD_PEPPER"];

            if (string.IsNullOrWhiteSpace(_pepper))
                throw new InvalidOperationException("PASSWORD_PEPPER is not set in environment variables.");
        }

        public string HashPassword(string password)
        {
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password is empty", nameof(password));

            string input = _pepper + password;

            return Sha256Custom.Hash(input);
        }

        public bool VerifyPassword(string password, string storedHash)
        {
            if (string.IsNullOrWhiteSpace(storedHash))
                return false;

            string computed = HashPassword(password);
            return FixedTimeEquals(computed, storedHash);
        }

       
    public static class Sha256Custom
        {
            private static readonly uint[] K =
            {
            0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,
            0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
            0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,
            0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
            0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,
            0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
            0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,
            0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
            0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,
            0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
            0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,
            0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
            0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,
            0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
            0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,
            0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
        };

            public static string Hash(string input)
            {
                byte[] data = Encoding.UTF8.GetBytes(input);
                byte[] padded = Pad(data);

                uint h0 = 0x6a09e667;
                uint h1 = 0xbb67ae85;
                uint h2 = 0x3c6ef372;
                uint h3 = 0xa54ff53a;
                uint h4 = 0x510e527f;
                uint h5 = 0x9b05688c;
                uint h6 = 0x1f83d9ab;
                uint h7 = 0x5be0cd19;

                for (int i = 0; i < padded.Length; i += 64)
                {
                    uint[] w = new uint[64];

                    for (int j = 0; j < 16; j++)
                        w[j] = ToUInt32(padded, i + j * 4);

                    for (int j = 16; j < 64; j++)
                        w[j] = Sigma1(w[j - 2]) + w[j - 7] + Sigma0(w[j - 15]) + w[j - 16];

                    uint a = h0, b = h1, c = h2, d = h3;
                    uint e = h4, f = h5, g = h6, h = h7;

                    for (int j = 0; j < 64; j++)
                    {
                        uint t1 = h + BigSigma1(e) + Ch(e, f, g) + K[j] + w[j];
                        uint t2 = BigSigma0(a) + Maj(a, b, c);

                        h = g;
                        g = f;
                        f = e;
                        e = d + t1;
                        d = c;
                        c = b;
                        b = a;
                        a = t1 + t2;
                    }

                    h0 += a; h1 += b; h2 += c; h3 += d;
                    h4 += e; h5 += f; h6 += g; h7 += h;
                }

                return $"{h0:x8}{h1:x8}{h2:x8}{h3:x8}{h4:x8}{h5:x8}{h6:x8}{h7:x8}";
            }

            private static byte[] Pad(byte[] input)
            {
                ulong bitLen = (ulong)input.Length * 8;
                int padLen = (int)((448 - (bitLen + 1)) % 512);
                if (padLen < 0) padLen += 512;

                byte[] padded = new byte[input.Length + 1 + padLen / 8 + 8];
                Array.Copy(input, padded, input.Length);
                padded[input.Length] = 0x80;

                for (int i = 0; i < 8; i++)
                    padded[padded.Length - 1 - i] = (byte)(bitLen >> (8 * i));

                return padded;
            }

         private static uint ToUInt32(byte[] b, int i) =>
                (uint)(b[i] << 24 | b[i + 1] << 16 | b[i + 2] << 8 | b[i + 3]);

            private static uint RotR(uint x, int n) => (x >> n) | (x << (32 - n));
            private static uint Ch(uint x, uint y, uint z) => (x & y) ^ (~x & z);
            private static uint Maj(uint x, uint y, uint z) => (x & y) ^ (x & z) ^ (y & z);
            private static uint Sigma0(uint x) => RotR(x, 7) ^ RotR(x, 18) ^ (x >> 3);
            private static uint Sigma1(uint x) => RotR(x, 17) ^ RotR(x, 19) ^ (x >> 10);
            private static uint BigSigma0(uint x) => RotR(x, 2) ^ RotR(x, 13) ^ RotR(x, 22);
            private static uint BigSigma1(uint x) => RotR(x, 6) ^ RotR(x, 11) ^ RotR(x, 25);
        }


        // constant-time compare
        private static bool FixedTimeEquals(string a, string b)
        {
            if (a == null || b == null || a.Length != b.Length) return false;

            int diff = 0;
            for (int i = 0; i < a.Length; i++)
                diff |= a[i] ^ b[i];

            return diff == 0;
        }
    }
}
