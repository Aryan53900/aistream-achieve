import { createContext, useContext, useState, useCallback } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  getBalance: () => Promise<string | null>;
  sendTransaction: (to: string, amount: string) => Promise<string | null>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return null;
    }

    setIsConnecting(true);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const account = accounts[0];
        setAccount(account);
        return account;
      }
      
      return null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
  }, []);

  const getBalance = useCallback(async (): Promise<string | null> => {
    if (!account || !window.ethereum) return null;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return null;
    }
  }, [account]);

  const sendTransaction = useCallback(async (to: string, amount: string): Promise<string | null> => {
    if (!account || !window.ethereum) return null;
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const transaction = {
        to,
        value: ethers.parseEther(amount),
      };
      
      const txResponse = await signer.sendTransaction(transaction);
      return txResponse.hash;
    } catch (error) {
      console.error('Error sending transaction:', error);
      return null;
    }
  }, [account]);

  const value = {
    account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    getBalance,
    sendTransaction,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};