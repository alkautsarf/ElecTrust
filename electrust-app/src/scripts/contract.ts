import { createWalletClient, custom, createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { elecTrustV3ABI } from "@/generated";
import { elecTrustV4ABI } from "@/generated";

export async function deployContract(
  address: any,
  electionName: string,
  candidateIndex: any,
  duration: any,
  candidateName: string,
) {
  try {
    const client = createWalletClient({
      account: address,
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
    });

    const hash = await client.deployContract({
      abi: elecTrustV4ABI,
      bytecode: `0x${process.env.NEXT_PUBLIC_BYTECODE_V4}`,
      account: address,
    });
    const tx = await publicClient.waitForTransactionReceipt({
      hash,
    });

    const candidateNames = candidateName.split(",").map((item) => item.trim());

    const { request: requestElection } = await publicClient.simulateContract({
      address: tx.contractAddress as `0x${string}`,
      abi: elecTrustV4ABI,
      functionName: "setElection",
      args: [electionName, candidateIndex, duration],
      account: address,
    });
    const hashSet = await client.writeContract(requestElection);
    const txSet = await publicClient.waitForTransactionReceipt({
      hash: hashSet,
    });

    candidateNames.forEach(async (item, index: any) => {
      try {

        const { request } = await publicClient.simulateContract({
          address: tx.contractAddress as `0x${string}`,
          abi: elecTrustV4ABI,
          functionName: "setCandidateName",
          args: [index + 1, item],
          account: address,
        });
        await client.writeContract(request);
      } catch (e) {

        return e;
      }
    });

    await handleSaveData(tx.contractAddress, address);
    return hash;
  } catch (e) {
    return e;
  }
}

export async function readContractData(contractAddress: any, functionName: any) {
  try {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
    });
    const wagmiContract = {
      address: contractAddress,
      abi: elecTrustV4ABI,
    } as const;
    const data = await publicClient.readContract({
      ...wagmiContract,
      functionName,
    });

    return data;
  } catch (e) {
    return e;
  }
}

export async function readElectionInfo(contractAddress: any) {
  try {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
    });
    const wagmiContract = {
      address: contractAddress,
      abi: elecTrustV4ABI,
    } as const;
    const results = await publicClient.multicall({
      contracts: [
        {
          ...wagmiContract,
          functionName: 'electionName',
        },
        {
          ...wagmiContract,
          functionName: 'totalCandidates',
        },
        {
          ...wagmiContract,
          functionName: 'duration',
        },
      ]
    })

    const fixedResult:any = {
      contractAddress,
      name: results[0].result,
      totalCandidates: Number(results[1].result),
      duration: Number(results[2].result),
      candidates: []
    }

    const index = Number(results[1].result);

    for(let i:any = 1; i <= index; i++) {
      let candidateInfo = await publicClient.multicall({
        contracts: [
          {
            ...wagmiContract,
            functionName: 'getCandidateName',
            args:[i]
          },
          {
            ...wagmiContract,
            functionName: 'getVotes',
            args:[i]
          },
        ]
      })
      fixedResult.candidates.push({
        name: candidateInfo[0].result,
        votes: Number(candidateInfo[1].result)
      })
    }
    return fixedResult;
  } catch (e) {
    return e;
  }
}

const handleSaveData = async (contractAddress: any, owner:any) => {
  const response = await fetch('/api/contractAddress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contractAddress, owner }),
  });

  if (response.ok) {
    console.log('success')
  } else {
    console.log('error')
  }
};

export async function castVote(address: any, contractAddress: any, candidateIndex: any) {
  try {
    const client = createWalletClient({
      account: address,
      chain: sepolia,
      transport: custom(window.ethereum),
    });
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA),
    });
    const { request } = await publicClient.simulateContract({
      address: contractAddress as `0x${string}`,
      abi: elecTrustV4ABI,
      functionName: "vote",
      args: [candidateIndex],
      account: address,
    })
    await client.writeContract(request)

  } catch (e) {
    return e
  }
}