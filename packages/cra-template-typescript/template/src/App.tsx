import React, {useEffect} from 'react';
import './App.css';
import {useWeb3React, createWeb3ReactRoot, Web3ReactProvider, UnsupportedChainIdError} from "@web3-react/core";
import getLibrary from "./utils/getLibrary";
import {useWeb3React as useWeb3ReactCore} from '@web3-react/core'
import ReactGA from 'react-ga'
import {isMobile} from 'react-device-detect'
import {injected, network, portis} from "./connectors";
import { useEagerConnect, useInactiveListener} from "./hook";
import {AbstractConnector} from "@web3-react/abstract-connector";
import {SUPPORTED_WALLETS} from "./constants";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import Option, {OptionGrid} from './components/WalletModal/Option'
import MetamaskIcon from './assets/images/metamask.png'
import { Provider } from 'react-redux'
import store from "./state";
import MulticallUpdater from "./state/multicall/updater";
import ApplicationUpdater from "./state/application/updater";
import {IndexPage} from "./view";
export const NetworkContextName = 'NETWORK'

export const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)
if ('ethereum' in window) {
    ;(window.ethereum as any).autoRefreshOnNetworkChange = false
}

const GOOGLE_ANALYTICS_ID: string | undefined = process.env.REACT_APP_GOOGLE_ANALYTICS_ID
if (typeof GOOGLE_ANALYTICS_ID === 'string') {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID)
    ReactGA.set({
        customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
    })
} else {
    ReactGA.initialize('test', {testMode: true, debug: true})
}

window.addEventListener('error', error => {
    ReactGA.exception({
        description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
        fatal: true
    })
})

function App() {

    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3ProviderNetwork getLibrary={getLibrary}>
                <BodyWidget/>
            </Web3ProviderNetwork>
        </Web3ReactProvider>
    );
}

const BodyWidget = () => {
    const {activate, connector, active, account} = useWeb3ReactCore() // specifically using useWeb3ReactCore because of what this hook does

    const {active: networkActive, error: networkError, activate: activateNetwork} = useWeb3React(NetworkContextName)
    const triedEager = useEagerConnect();

    const tryActivation = async (connector: AbstractConnector | undefined) => {
        let name = ''
        Object.keys(SUPPORTED_WALLETS).map(key => {
            if (connector === SUPPORTED_WALLETS[key].connector) {
                return (name = SUPPORTED_WALLETS[key].name)
            }
            return true
        })
        // log selected wallet
        ReactGA.event({
            category: 'Wallet',
            action: 'Change Wallet',
            label: name
        })

        // if the connector is walletconnect and the user has already tried to connect, manually reset the connector
        if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
            connector.walletConnectProvider = undefined
        }

        connector &&
        activate(connector, undefined, true).catch(error => {
            if (error instanceof UnsupportedChainIdError) {
                activate(connector) // a little janky...can't use setError because the connector isn't set
            } else {
                console.log('---------->');
                // setPendingError(true)
            }
        })
    }
    useEffect(() => {
        if (triedEager && !networkActive && !networkError && !active) {
            activateNetwork(network)
        }
    }, [triedEager, networkActive, networkError, activateNetwork, active])

    function getOptions() {
        const isMetamask = window.ethereum && window.ethereum.isMetaMask
        return Object.keys(SUPPORTED_WALLETS).map(key => {
            const option = SUPPORTED_WALLETS[key]
            if (isMobile) {
                if (option.connector === portis) {
                    return null
                }
                if (!window.web3 && !window.ethereum && option.mobile) {
                    return (
                        <Option
                            onClick={() => {
                                option.connector !== connector && !option.href && tryActivation(option.connector)
                            }}
                            id={`connect-${key}`}
                            key={key}
                            active={option.connector && option.connector === connector}
                            color={option.color}
                            link={option.href}
                            header={option.name}
                            subheader={null}
                            icon={require('./assets/images/' + option.iconName).default}
                        />
                    )
                }
                return null
            }

            // overwrite injected when needed
            if (option.connector === injected) {
                // don't show injected if there's no injected provider
                if (!(window.web3 || window.ethereum)) {
                    if (option.name === 'MetaMask') {
                        return (
                            <Option
                                id={`connect-${key}`}
                                key={key}
                                color={'#E8831D'}
                                header={'Install Metamask'}
                                subheader={null}
                                link={'https://metamask.io/'}
                                icon={MetamaskIcon}
                            />
                        )
                    } else {
                        return null //dont want to return install twice
                    }
                }
                // don't return metamask if injected provider isn't metamask
                else if (option.name === 'MetaMask' && !isMetamask) {
                    return null
                }
                // likewise for generic
                else if (option.name === 'Injected' && isMetamask) {
                    return null
                }
            }

            return (
                !isMobile &&
                !option.mobileOnly && (
                    <Option
                        id={`connect-${key}`}
                        onClick={() => {
                            if (option.connector !== connector)
                                !option.href && tryActivation(option.connector)
                        }}
                        key={key}
                        active={option.connector === connector}
                        color={option.color}
                        link={option.href}
                        header={option.name}
                        subheader={null}
                        icon={require('./assets/images/' + option.iconName).default}

                    />
                )
            )
        })
    }


    useInactiveListener(!triedEager)

    function Updaters() {
        return (
            <>
                <ApplicationUpdater />
                <MulticallUpdater />
            </>
        )
    }

    return (
        <div>
        <Provider store={store}>
            <Updaters />
            {
                account ? <IndexPage /> : <OptionGrid>
                    <div>
                        {getOptions()}
                    </div>
                </OptionGrid>
            }
        </Provider>

        </div>
    );
}


export default App;
