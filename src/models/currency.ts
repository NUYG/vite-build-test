import {floatFixed, getItemFromLocalStorage, setLocalStorageItem} from "@/utils/utils";
import {post} from "@/utils/dataQuery";
import {uPriceFullPfx, uPricePfx, uPricePfxExt, uPricePfxHalfExt} from "@/utils/unit";


export enum Currency {
    VND = 'VND',
    USD = 'USD'
}

export const CurrencyData = {
    VND: Currency.VND,
    USD: Currency.USD
}

enum LargeNumbers {
    Billion = 1000000000,
    Million = 1000000,
}

export const CurrencyUnit = {
    [Currency.USD] : '$',
}
export const getCurrentCurrencyUnit = () => {
    const currencyName: string= getCurrentCurrencyName()
    return CurrencyUnit[currencyName] || '';
}
export const getCurrentCurrencyName = () => {
    return getItemFromLocalStorage('currency') || 'VND'
}

export const getCurrentRate = () => {
    const rateString = getItemFromLocalStorage('currentRate') || '1';
    const rate = parseFloat(rateString);
    return isNaN(rate) ? 1 : rate;
}

export const getSeverCurrencyRate = async (currencyName: string) => {
    console.log('lấy giá ,')
    if (currencyName) {
        const res = await post('/finance/get_currency_rate', {
            currency: currencyName
        })
        if (res) {
            setLocalStorageItem('currentRate', res.returnData)
            return res.succeed
        }
    }
}

export const convertUnit = (renting: boolean) => {
    return renting ? LargeNumbers.Million : LargeNumbers.Billion
}

export const convertCurrency = (amount: number, fromCurrency: Currency, exchangeRate: number) => {
    if (exchangeRate === 0) {
        throw new Error(`Vui lòng chọn giá tiền chuyển đổi lớn hơn 0`);
    } else if (fromCurrency === Currency.VND) {
        return amount * exchangeRate;
    }
};

export const convertVndToUserCurrency = (amount: number, renting: boolean, unit: UnitCurrency = UnitCurrency.default, isString: boolean =true) => {
    if(amount===0 || !amount)
    {
        return ''
    }
    const parseAmount = amount * (renting ? LargeNumbers.Million : LargeNumbers.Billion);
    if (getCurrentCurrencyName() === Currency.VND || getCurrentCurrencyName() === '') {
        switch (unit) {
            case UnitCurrency.simple:
                return floatFixed(amount,3) + uPricePfx(renting);
            case UnitCurrency.full:
                return floatFixed(amount,3) + uPriceFullPfx(renting);
            case UnitCurrency.extend:
                return floatFixed(amount,3) + uPricePfxExt(renting);
            case UnitCurrency.half:
                return floatFixed(amount, 3) + uPricePfxHalfExt(renting)
            default:
                return floatFixed(amount,3);
        }
    } else if(isString){
        return `~` + floatFixed(getCurrentRate() * parseAmount,3) + getCurrentCurrencyUnit()
    }
    else {
        return getCurrentRate() * parseAmount
    }
}

export const convertCurrencyToVnd = (amount: number, renting: boolean = true) => {
    const floatNumb = renting ? LargeNumbers.Million : LargeNumbers.Billion
    return floatFixed((amount / getCurrentRate()) / floatNumb )
}

export enum UnitCurrency  {
    default = '',
    simple='simple',
    full ='full',
    extend='extend',
    half = 'half'
}

export const unitTextOfCurrency = {
    [UnitCurrency.extend]: (renting: boolean) => uPricePfx(renting),
    [UnitCurrency.full]: (renting: boolean) => uPriceFullPfx(renting),
    [UnitCurrency.simple]: (renting: boolean) => uPricePfxExt(renting),
    [UnitCurrency.half] : (renting: boolean) => uPricePfxHalfExt(renting)
};
