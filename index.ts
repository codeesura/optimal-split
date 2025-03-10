import ethers from 'ethers';

interface Dex {
    name: string;
    wethLiquidity: ethers.BigNumber;
    usdcLiquidity: ethers.BigNumber;
}

const dexA: Dex = {
    name: "DEX-A",
    wethLiquidity: ethers.utils.parseEther("100"),
    usdcLiquidity: ethers.utils.parseUnits("200150", 6)
};

const dexB: Dex = {
    name: "DEX-B",
    wethLiquidity: ethers.utils.parseEther("250"),
    usdcLiquidity: ethers.utils.parseUnits("500000", 6)
};

function calculateWethPrice(dex: Dex, amount: ethers.BigNumber): ethers.BigNumber {
    const wethAmount = dex.wethLiquidity;
    const usdcAmount = dex.usdcLiquidity;
    const k = wethAmount.mul(usdcAmount);
    const wethAmountAfter = wethAmount.add(amount);
    return usdcAmount.sub(k.div(wethAmountAfter));
}

function formatUSDC(amount: ethers.BigNumber): string {
    return ethers.utils.formatUnits(amount, 6);
}

function optimalSplit(dexA: Dex, dexB: Dex, inputAmount: ethers.BigNumber) {
    let lo = ethers.BigNumber.from(0);
    let hi = inputAmount;

    const derivativeSign = (amount: ethers.BigNumber) => {
        const left = dexA.wethLiquidity.mul(dexA.usdcLiquidity).mul(dexB.wethLiquidity.add(inputAmount.sub(amount)).pow(2));
        const right = dexB.wethLiquidity.mul(dexB.usdcLiquidity).mul(dexA.wethLiquidity.add(amount).pow(2));
        return left.gt(right);
    };

    while (hi.sub(lo).gt(1)) {
        const mid = lo.add(hi).div(2);
        if (derivativeSign(mid)) {
            lo = mid;
        } else {
            hi = mid;
        }
    }

    const outA_lo = calculateWethPrice(dexA, lo);
    const outB_lo = calculateWethPrice(dexB, inputAmount.sub(lo));

    const outA_hi = calculateWethPrice(dexA, hi);
    const outB_hi = calculateWethPrice(dexB, inputAmount.sub(hi));

    const total_lo = outA_lo.add(outB_lo);
    const total_hi = outA_hi.add(outB_hi);

    return total_hi.gt(total_lo)
        ? { dexAAmount: hi, dexBAmount: inputAmount.sub(hi) }
        : { dexAAmount: lo, dexBAmount: inputAmount.sub(lo) };
}

const inputAmount = ethers.utils.parseUnits("1", 18);
const optimalSplitResult = optimalSplit(dexA, dexB, inputAmount);

const totalOutput = calculateWethPrice(dexA, optimalSplitResult.dexAAmount)
    .add(calculateWethPrice(dexB, optimalSplitResult.dexBAmount));

console.log(`Optimal split: ${ethers.utils.formatEther(optimalSplitResult.dexAAmount)} WETH on DEX-A, ${ethers.utils.formatEther(optimalSplitResult.dexBAmount)} WETH on DEX-B`);
console.log(`Total USDC output: ${formatUSDC(totalOutput)} USDC`);