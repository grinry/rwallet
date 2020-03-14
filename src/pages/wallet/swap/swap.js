import React, { Component } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Image, TextInput, ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SwapHeader from '../../../components/headers/header.swap';
import BasePageGereral from '../../base/base.page.general';
import Button from '../../../components/common/button/button';
import space from '../../../assets/styles/space';
import color from '../../../assets/styles/color.ts';
import presetStyles from '../../../assets/styles/style';
import common from '../../../common/common';
import CoinswitchHelper from '../../../common/coinswitch.helper';
import Transaction from '../../../common/transaction';
import appActions from '../../../redux/app/actions';
import { createErrorNotification, createInfoNotification } from '../../../common/notification.controller';
import walletActions from '../../../redux/wallet/actions';
import Loc from '../../../components/common/misc/loc';
import definitions from '../../../common/definitions';
import parseHelper from '../../../common/parse';
import { createErrorConfirmation } from '../../../common/confirmation.controller';
import config from '../../../../config';
import CancelablePromiseUtil from '../../../common/cancelable.promise.util';


const styles = StyleSheet.create({
  body: {
    marginTop: -330,
    marginHorizontal: 20,
  },
  board: {
    paddingHorizontal: 28,
    paddingVertical: 22,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 30,
  },
  greenLine: {
    marginTop: 7,
    marginBottom: 15,
    width: 35,
    height: 3,
    backgroundColor: '#00B520',
    borderRadius: 1.5,
  },
  listText: {
    lineHeight: 25,
  },
  rightButton: {
    color: '#FFF',
  },
  sepratorLine: {
    backgroundColor: '#FFF',
    height: StyleSheet.hairlineWidth,
    flex: 1,
  },
  seprator: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 25,
    marginVertical: 12,
  },
  exchangeIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  exchangeIconView: {
    width: 43,
    alignSelf: 'center',
    alignItems: 'center',
  },
  operationView: {
    backgroundColor: '#F3F7F4',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
  },
  boardTokenViewLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationAmount: {
    color: '#FFBB00',
  },
  operationValue: {
    alignSelf: 'flex-end',
  },
  operationLeft: {
    flex: 1,
  },
  operationRight: {

  },
  receivingAmount: {
    color: '#00B520',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  boardTokenIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
    marginLeft: -5,
  },
  boardTokenName: {
    fontSize: 25,
    color: color.component.swipableButtonList.title.color,
    fontFamily: 'Avenir-Book',
    letterSpacing: 0.4,
  },
  boardText: {
    color: '#9B9B9B',
  },
  boardWalletName: {
    color: '#000',
  },
  boardTokenView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  boardTokenExchangeIcon: {
    marginTop: -6,
  },
  boardAmountView: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  sourceAmount: {
    flex: 1,
    paddingRight: 50,
  },
  textInput: {
    color: '#000',
    fontFamily: 'Avenir-Book',
    fontSize: 27,
  },
  boardAmount: {
    color: '#000',
    fontSize: 27,
    fontFamily: 'Avenir-Book',
    letterSpacing: 0.4,
    flex: 1,
  },
  boardValue: {
    fontFamily: 'Avenir-Book',
  },
  switchView: {
    height: 40,
    marginTop: 33,
    backgroundColor: '#F3F3F3',
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  switchItem: {
    width: '33.3%',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    borderRadius: 25,
  },
  switchItemActived: {
    position: 'absolute',
    left: '33.3%',
    width: '33.3%',
    height: '100%',
    borderRadius: 25,
    backgroundColor: '#00B520',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontFamily: 'Avenir-Heavy',
  },
  switchTextActived: {
    color: '#FFF',
  },
  error: {
    marginRight: 10,
  },
  errorView: {
    backgroundColor: '#F3F7F4',
    borderRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingHorizontal: 22,
  },
  errorText: {
    flex: 1,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    opacity: 0.75,
    borderWidth: 0,
  },
});

const res = {};
res.exchange = require('../../../assets/images/icon/exchange.png');
res.BTC = require('../../../assets/images/icon/BTC.png');
res.RBTC = require('../../../assets/images/icon/RBTC.png');
res.RIF = require('../../../assets/images/icon/RIF.png');
res.currencyExchange = require('../../../assets/images/icon/currencyExchange.png');
res.error = require('../../../assets/images/icon/error.png');

const switchItems = ['MIN', 'HALF', 'ALL'];

class Swap extends Component {
  static navigationOptions = () => ({
    header: null,
  });

  constructor(props) {
    super(props);
    this.onExchangePress = this.onExchangePress.bind(this);
    this.onSwitchPress = this.onSwitchPress.bind(this);
    this.onHistoryPress = this.onHistoryPress.bind(this);
    this.onSelectSourcePress = this.onSelectSourcePress.bind(this);
    this.onSelectDestPress = this.onSelectDestPress.bind(this);
    this.onChangeSourceAmount = this.onChangeSourceAmount.bind(this);
    this.txFeesCache = {};
    this.onChangeDestAmount = this.onChangeDestAmount.bind(this);
    this.state = {
      switchIndex: -1,
      isBalanceEnough: false,
      isAmountInRange: false,
      sourceAmount: null,
      destAmount: null,
      sourceText: null,
      destText: null,
      rate: -1,
      limitMinDepositCoin: -1,
      limitMaxDepositCoin: -1,
      limitHalfDepositCoin: -1,
      sourceUsdRate: -1,
      destUsdRate: -1,
      coinLoading: false,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.willFocusSubscription = navigation.addListener(
      'willFocus',
      () => {
        this.updateSwapData();
      },
    );
  }

  componentWillUnmount() {
    const { resetSwapDest, resetSwapSource, removeConfirmation } = this.props;
    resetSwapSource();
    resetSwapDest();
    this.willFocusSubscription.remove();
    CancelablePromiseUtil.cancel(this);
    removeConfirmation();
  }

  async onExchangePress() {
    const {
      navigation, swapSource, swapDest, addNotification,
    } = this.props;
    const { sourceAmount } = this.state;

    try {
      this.setState({ loading: true });
      const { address: sourceAddress, id: sourceId } = swapSource.coin;
      const { address: destAddress, id: destId } = swapDest.coin;
      const sourceCoin = sourceId.toLowerCase();
      const destCoin = destId.toLowerCase();
      const order = await CoinswitchHelper.placeOrder(sourceCoin, destCoin, sourceAmount, { address: destAddress }, { address: sourceAddress });
      const {
        exchangeAddress: { address: agentAddress },
      } = order;
      const feeObject = await this.requestFee(sourceAmount, swapSource);
      const gasFee = feeObject.feeParams;
      const extraParams = {
        data: '', memo: '', gasFee, coinswitch: { order },
      };
      let transaction = new Transaction(swapSource.coin, agentAddress, sourceAmount, extraParams);
      console.log('transaction: ', transaction);
      await transaction.processRawTransaction();
      await transaction.signTransaction();
      await transaction.processSignedTransaction();
      this.setState({ loading: false });
      const completedParams = {
        symbol: swapSource.coin.symbol,
        type: swapSource.coin.type,
        hash: transaction.txHash,
      };
      navigation.navigate('SwapCompleted', completedParams);
      transaction = null;
    } catch (error) {
      this.setState({ loading: false });
      console.log(`confirm, error: ${error.message}`);
      const buttonText = 'button.retry';
      let notification = null;
      if (error.code === 141) {
        const message = error.message.split('|');
        console.log(message[0]);
        switch (message[0]) {
          case 'err.notenoughbalance.btc':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreBTC',
              buttonText,
            );
            break;
          case 'err.notenoughbalance.rbtc':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreRBTC',
              buttonText,
            );
            break;
          case 'err.notenoughbalance.rif':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreRIF',
              buttonText,
            );
            break;
          case 'err.notenoughbalance':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.moreBalance',
              buttonText,
            );
            break;
          case 'err.timeout':
            notification = createErrorNotification(
              'modal.txFailed.title',
              'modal.txFailed.serverTimeout',
              buttonText,
            );
            addNotification(notification);
            break;
          case 'err.customized':
            notification = createErrorNotification(
              'modal.txFailed.title',
              message[1],
              buttonText,
            );
            break;
          default:
            break;
        }
      }
      // Default error notification
      if (!notification) {
        notification = createErrorNotification(
          'modal.txFailed.title',
          'modal.txFailed.contactService',
          buttonText,
        );
      }
      addNotification(notification);
    }
  }

  onSwitchPress = (index) => {
    const { swapDest, swapSource } = this.props;
    const {
      limitMinDepositCoin, limitMaxDepositCoin, limitHalfDepositCoin, rate,
    } = this.state;
    let amount = -1;
    switch (index) {
      case 0:
        amount = limitMinDepositCoin;
        break;
      case 1:
        amount = limitHalfDepositCoin;
        break;
      case 2:
        amount = limitMaxDepositCoin;
        break;
      default:
    }
    const amountState = this.getAmountState(amount, swapDest, swapSource, limitMinDepositCoin, limitMaxDepositCoin, rate);
    this.setState({
      switchIndex: index,
      sourceText: amount.toString(),
      ...amountState,
    });
  };

  onHistoryPress() {
    const { navigation, swapSource } = this.props;
    navigation.navigate('WalletHistory', { coin: swapSource.coin });
  }

  onSelectSourcePress() {
    const { navigation } = this.props;
    navigation.push('SwapSelection', { selectionType: 'source' });
  }

  onSelectDestPress() {
    const { navigation } = this.props;
    navigation.push('SwapSelection', { selectionType: 'dest' });
  }

  onChangeSourceAmount(text) {
    const { swapDest, swapSource } = this.props;
    const { limitMinDepositCoin, limitMaxDepositCoin, rate } = this.state;
    const isAmount = common.isAmount(text);
    let sourceAmount = null;
    if (isAmount) {
      sourceAmount = parseFloat(text);
    }
    const amountState = this.getAmountState(sourceAmount, swapDest, swapSource, limitMinDepositCoin, limitMaxDepositCoin, rate);
    this.setState({ sourceText: text, switchIndex: -1, ...amountState });
  }

  onChangeDestAmount(text) {
    const { swapDest, swapSource } = this.props;
    const { limitMinDepositCoin, limitMaxDepositCoin, rate } = this.state;
    const isAmount = common.isAmount(text);
    let destAmount = null;
    if (isAmount) {
      destAmount = parseFloat(text);
    }
    const amountState = this.getAmountState(destAmount, swapDest, swapSource, limitMinDepositCoin, limitMaxDepositCoin, rate, 'dest');
    this.setState({ destText: text, switchIndex: -1, ...amountState });
  }

  getAmountState = (amount, swapDest, swapSource, limitMinDepositCoin, limitMaxDepositCoin, rate, type = 'source') => {
    let sourceAmount;
    let destAmount;
    let textValue;
    if (!amount) {
      textValue = type === 'source' ? { destText: null } : { sourceText: null };
      return {
        sourceAmount: null, destAmount: null, isBalanceEnough: false, ...textValue,
      };
    }
    const decimalPlaces = config.symbolDecimalPlaces[type === 'source' ? swapDest.coin.symbol : swapSource.coin.symbol];
    if (type === 'source') {
      sourceAmount = amount;
      destAmount = swapDest && rate ? parseFloat((sourceAmount * rate).toPrecision(decimalPlaces)) : null;
      textValue = { destText: destAmount.toString() };
    } else {
      destAmount = amount;
      sourceAmount = swapSource && rate ? parseFloat((destAmount / rate).toPrecision(decimalPlaces)) : null;
      textValue = { sourceText: sourceAmount.toString() };
    }
    const isAmountInRange = sourceAmount >= limitMinDepositCoin && sourceAmount <= limitMaxDepositCoin;
    const isBalanceEnough = swapSource.coin.balance.isGreaterThanOrEqualTo(sourceAmount);
    return {
      sourceAmount, destAmount, isBalanceEnough, isAmountInRange, ...textValue,
    };
  };

  updateRateInfoAndFee = async (currentSwapSource, currentSwapDest, props) => {
    console.log('updateRateInfoAndFee', currentSwapSource, currentSwapDest, props);
    const {
      navigation, addConfirmation, swapDest, swapSource,
    } = props;
    const { sourceAmount } = this.state;
    const sourceCoinId = currentSwapSource.coin.id.toLowerCase();
    const destCoinId = currentSwapDest.coin.id.toLowerCase();
    this.setState({ coinLoading: true });
    try {
      const sdRate = await CancelablePromiseUtil.makeCancelable(CoinswitchHelper.getRate(sourceCoinId, destCoinId), this);
      const { rate, limitMinDepositCoin, limitMaxDepositCoin } = sdRate;

      const amountState = this.getAmountState(sourceAmount, swapDest, swapSource, limitMinDepositCoin, limitMaxDepositCoin, rate);

      // const feeObject = await CancelablePromiseUtil.makeCancelable(this.requestFee(currentSwapSource.coin.balance, currentSwapSource), this);
      // const maxDepositCoin = common.formatAmount(currentSwapSource.coin.balance.minus(feeObject.fee), currentSwapSource.coin.decimalPlaces);
      const maxDepositCoin = common.formatAmount(currentSwapSource.coin.balance, currentSwapSource.coin.decimalPlaces);
      const limitHalfDepositCoin = common.formatAmount(currentSwapSource.coin.balance.div(2), currentSwapSource.coin.decimalPlaces);

      this.setState({
        rate,
        limitMinDepositCoin,
        limitMaxDepositCoin: maxDepositCoin,
        limitHalfDepositCoin,
        coinLoading: false,
        ...amountState,
      });
    } catch (err) {
      console.log('updateRateInfoAndFee, err', err);
      this.setState({ coinLoading: false });
      const confirmation = createErrorConfirmation(
        definitions.defaultErrorNotification.title,
        definitions.defaultErrorNotification.message,
        'button.retry',
        () => this.updateRateInfoAndFee(currentSwapSource, currentSwapDest, props),
        () => navigation.goBack(),
      );
      addConfirmation(confirmation);
      this.setState({ coinLoading: false });
    }
  };

  getFeeParams = (symbol, fees) => {
    if (symbol === 'BTC') {
      return { fees: fees.fees.medium };
    }
    return {
      gasPrice: fees.gasPrice.medium,
      gas: fees.gas,
    };
  };

  switchSourceDest = () => {
    const { switchSwap } = this.props;
    const { destAmount } = this.state;
    switchSwap();
    const text = destAmount ? destAmount.toString() : '';
    const isAmount = common.isAmount(text);
    let sourceAmount = null;
    if (isAmount) {
      sourceAmount = parseFloat(text);
    }
    this.setState({ sourceText: text, switchIndex: -1, sourceAmount }, () => setTimeout(() => {
      this.updateSwapData();
    }, 0));
  };

  // Request fee from network, returns { fee, feeParams }
  async requestFee(sourceAmount, swapSource) {
    const { symbol, type, address } = swapSource.coin;
    const transactionFees = await this.loadTransactionFees(symbol, type, address, sourceAmount);
    let fee = null;
    let feeParams = null;
    if (symbol === 'BTC') {
      const { medium } = transactionFees.fees;
      const feeHex = `0x${medium.toString(16)}`;
      feeParams = { fees: feeHex };
      fee = common.convertUnitToCoinAmount(symbol, medium);
    } else {
      const { gas, gasPrice: { medium } } = transactionFees;
      feeParams = { gas, gasPrice: medium };
      fee = common.convertUnitToCoinAmount(symbol, gas * medium);
    }
    return { fee, feeParams };
  }

  async loadTransactionFees(symbol, type, address, amount) {
    const { amount: lastAmount } = this.txFeesCache;
    if (amount === lastAmount) {
      return this.txFeesCache.transactionFees;
    }
    const amountHex = symbol === 'BTC' ? common.btcToSatoshiHex(amount) : common.rskCoinToWeiHex(amount);
    const transactionFees = await parseHelper.getTransactionFees(symbol, type, address, address, amountHex);
    this.txFeesCache = { amount, transactionFees };
    return transactionFees;
  }

  updateSwapData() {
    const {
      swapSource, swapDest, addNotification, navigation,
    } = this.props;
    if (swapSource && swapDest) {
      const { swapSource: currentSwapSource, swapDest: currentSwapDest, prices } = this.props;
      const suRate = currentSwapSource ? prices.find((price) => price.symbol === currentSwapSource.coin.symbol) : null;
      const duRate = currentSwapDest ? prices.find((price) => price.symbol === currentSwapDest.coin.symbol) : null;
      if (suRate) this.setState({ sourceUsdRate: parseFloat(suRate.price.USD) });
      if (duRate) this.setState({ destUsdRate: parseFloat(duRate.price.USD) });
      this.updateRateInfoAndFee(currentSwapSource, currentSwapDest, this.props);
    } else if (!swapSource && !swapDest) {
      const notification = createInfoNotification(
        'modal.swap.title',
        'modal.swap.body',
        'button.addAsset',
        () => navigation.navigate('Home'),
      );
      addNotification(notification);
    } else if (!swapSource || !swapDest) {
      this.resetAmountState();
    }
  }

  resetAmountState() {
    this.setState({
      destAmount: null,
      destText: null,
      rate: -1,
      limitMinDepositCoin: -1,
      limitMaxDepositCoin: -1,
      limitHalfDepositCoin: -1,
    });
  }

  renderExchangeStateBlock = (sourceValueText, destValueText) => {
    const {
      isBalanceEnough, sourceAmount, destAmount, limitMinDepositCoin, limitMaxDepositCoin,
    } = this.state;
    const { swapSource } = this.props;
    let errorText = null;
    let additionalInfo = '';
    if (!sourceAmount) {
      errorText = 'page.wallet.swap.errorSourceAmount';
    } else if (!destAmount) {
      errorText = 'page.wallet.swap.errorDestAmount';
    } else if (!isBalanceEnough) {
      errorText = 'page.wallet.swap.errorBalanceEnough';
    } else if (sourceAmount < limitMinDepositCoin) {
      errorText = 'page.wallet.swap.errorAmountInRange.tooSmall';
      additionalInfo = `${limitMinDepositCoin} ${swapSource.coin.symbol}`;
    } else if (sourceAmount > limitMaxDepositCoin) {
      errorText = 'page.wallet.swap.errorAmountInRange.tooBig';
      additionalInfo = `${limitMaxDepositCoin} ${swapSource.coin.symbol}`;
    }

    if (errorText) {
      return (
        <View style={[styles.errorView, space.marginTop_27]}>
          <Image style={styles.error} source={res.error} />
          <View style={styles.errorText}>
            <Loc text={errorText} suffix={additionalInfo} />
          </View>
        </View>
      );
    }
    return (
      <View>
        <View style={[styles.operationView, space.marginTop_27]}>
          <View style={styles.operationLeft}>
            <Text>Exchanging</Text>
          </View>
          <View style={styles.operationRight}>
            {sourceAmount && <Text style={styles.operationAmount}>{sourceAmount.toString()}</Text>}
            <Text style={styles.operationValue}>{sourceValueText}</Text>
          </View>
        </View>
        <View style={[styles.operationView, space.marginTop_10]}>
          <View style={styles.operationLeft}>
            <Text>Receiving</Text>
          </View>
          <View style={styles.operationRight}>
            {destAmount && <Text style={[styles.operationAmount, styles.receivingAmount]}>{`+${destAmount}`}</Text>}
            <Text style={styles.operationValue}>{destValueText ? `+${destValueText}` : ''}</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {
      navigation, swapSource, swapDest, currency,
    } = this.props;
    const {
      isBalanceEnough, isAmountInRange, sourceAmount, destAmount, sourceText, destText, sourceUsdRate, destUsdRate,
      limitMinDepositCoin, limitMaxDepositCoin, rate, coinLoading, loading, switchIndex,
    } = this.state;

    const currencySymbol = common.getCurrencySymbol(currency);
    const sourceValueText = sourceAmount && sourceUsdRate ? currencySymbol + (sourceAmount * sourceUsdRate).toFixed(2) : '';
    const destValueText = destAmount && destUsdRate ? currencySymbol + (destAmount * destUsdRate).toFixed(2) : '';

    const balanceText = swapSource && swapSource.coin.balance ? common.getBalanceString(swapSource.coin.balance, swapSource.coin.decimalPlaces) : '';

    const isCanSwitchSourceDest = swapSource && swapDest && !coinLoading;

    const customBottomButton = (
      swapSource ? (
        <Button
          text="button.Exchange"
          disabled={!isAmountInRange || !isBalanceEnough}
          onPress={this.onExchangePress}
        />
      ) : null
    );

    return (
      <BasePageGereral
        isSafeView
        hasLoader
        isLoading={loading}
        headerComponent={<SwapHeader title="page.wallet.swap.title" onBackButtonPress={() => navigation.goBack()} rightButton={<View />} />}
        customBottomButton={customBottomButton}
      >
        <View style={styles.body}>
          <View style={[presetStyles.board, styles.board]}>
            <Text style={styles.boardText}>
              <Loc text="page.wallet.swap.have" suffix={swapSource ? `${balanceText} ${swapSource.coin.symbol} ` : ''} />
              {swapSource && <Loc text="page.wallet.swap.in" suffix={` ${swapSource.walletName}`} />}
            </Text>
            <View style={styles.boardTokenView}>
              <TouchableOpacity onPress={this.onSelectSourcePress} style={styles.boardTokenViewLeft}>
                {swapSource && <Image style={styles.boardTokenIcon} source={swapSource.coin.icon} />}
                {swapSource && <Text style={styles.boardTokenName}>{swapSource.coin.symbol}</Text>}
                <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
              </TouchableOpacity>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <View style={styles.sourceAmount}>
                <TextInput
                  style={[styles.textInput]}
                  value={sourceText}
                  onChangeText={this.onChangeSourceAmount}
                  placeholder="0.00"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              <Text style={styles.boardValue}>{sourceValueText}</Text>
            </View>
            {coinLoading && (
            <View style={[styles.cardOverlay, presetStyles.board]}>
              <ActivityIndicator
                size="large"
                animating={coinLoading}
              />
            </View>
            )}
          </View>
          <View style={styles.seprator}>
            <View style={styles.sepratorLine} />
            <TouchableOpacity
              style={[styles.exchangeIconView, { opacity: isCanSwitchSourceDest ? 1 : 0.3 }]}
              disabled={!isCanSwitchSourceDest}
              onPress={this.switchSourceDest}
            >
              <Image style={styles.exchangeIcon} source={res.exchange} />
            </TouchableOpacity>
            <View style={styles.sepratorLine} />
          </View>
          <View style={[presetStyles.board, styles.board]}>
            { swapDest && (
              <Text style={styles.boardText}>
                <Loc text="page.wallet.swap.want" />
                {` ${swapDest.coin.symbol} `}
                <Loc text="page.wallet.swap.in" suffix={` ${swapDest.walletName}`} />
              </Text>
            )}
            <View style={styles.boardTokenView}>
              <TouchableOpacity onPress={this.onSelectDestPress} style={styles.boardTokenViewLeft}>
                {swapDest && (<Image style={styles.boardTokenIcon} source={swapDest.coin.icon} />)}
                {swapDest && (<Text style={styles.boardTokenName}>{swapDest.coin.symbol}</Text>)}
                <EvilIcons name="chevron-down" color="#9B9B9B" size={40} />
              </TouchableOpacity>
              <Image style={styles.boardTokenExchangeIcon} source={res.currencyExchange} />
            </View>
            <View style={styles.boardAmountView}>
              <View style={styles.sourceAmount}>
                <TextInput
                  style={[styles.textInput]}
                  value={destText}
                  onChangeText={this.onChangeDestAmount}
                  placeholder="0.00"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!!swapDest}
                />
              </View>
              <Text style={styles.boardValue}>{destValueText}</Text>
            </View>
            {coinLoading && swapDest && (
              <View style={[styles.cardOverlay, presetStyles.board]}>
                <ActivityIndicator
                  size="large"
                  animating={coinLoading}
                />
              </View>
            )}
          </View>
          <View
            pointerEvents={rate > 0 && limitMinDepositCoin > 0 && limitMaxDepositCoin > 0 && !coinLoading ? 'auto' : 'none'}
            style={styles.switchView}
          >
            <TouchableOpacity style={[styles.switchItem, switchIndex === 0 ? { backgroundColor: color.component.button.backgroundColor } : {}]} onPress={() => this.onSwitchPress(0)}>
              <Text style={[styles.switchText]}>{limitMinDepositCoin > 0 ? `${switchItems[0]}(${limitMinDepositCoin})` : switchItems[0]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.switchItem, switchIndex === 1 ? { backgroundColor: color.component.button.backgroundColor } : {}]} onPress={() => this.onSwitchPress(1)}>
              <Text style={styles.switchText}>{switchItems[1]}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.switchItem, switchIndex === 2 ? { backgroundColor: color.component.button.backgroundColor } : {}]} onPress={() => this.onSwitchPress(2)}>
              <Text style={styles.switchText}>{limitMaxDepositCoin > 0 ? `${switchItems[2]}(${limitMaxDepositCoin})` : switchItems[2]}</Text>
            </TouchableOpacity>
          </View>
          { swapSource && this.renderExchangeStateBlock(sourceValueText, destValueText) }
        </View>
      </BasePageGereral>
    );
  }
}

Swap.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  swapSource: PropTypes.shape({
    walletName: PropTypes.string.isRequired,
    coin: PropTypes.object.isRequired,
  }),
  swapDest: PropTypes.shape({
    walletName: PropTypes.string.isRequired,
    coin: PropTypes.object.isRequired,
  }),
  prices: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  currency: PropTypes.string.isRequired,
  addNotification: PropTypes.func.isRequired,
  removeConfirmation: PropTypes.func.isRequired,
  switchSwap: PropTypes.func.isRequired,
  resetSwapSource: PropTypes.func.isRequired,
  resetSwapDest: PropTypes.func.isRequired,
  walletManager: PropTypes.shape({
    wallets: PropTypes.array.isRequired,
  }).isRequired,
};

Swap.defaultProps = {
  swapSource: null,
  swapDest: null,
};

const mapStateToProps = (state) => ({
  walletManager: state.Wallet.get('walletManager'),
  swapSource: state.Wallet.get('swapSource'),
  swapDest: state.Wallet.get('swapDest'),
  prices: state.Wallet.get('prices'),
  currency: state.App.get('currency'),
});

const mapDispatchToProps = (dispatch) => ({
  addNotification: (notification) => dispatch(
    appActions.addNotification(notification),
  ),
  addConfirmation: (confirmation) => dispatch(
    appActions.addConfirmation(confirmation),
  ),
  removeConfirmation: () => dispatch(appActions.removeConfirmation()),
  switchSwap: () => dispatch(walletActions.switchSwap()),
  resetSwapSource: () => dispatch(walletActions.resetSwapSource()),
  resetSwapDest: () => dispatch(walletActions.resetSwapDest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
