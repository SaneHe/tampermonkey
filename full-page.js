// ==UserScript==
// @name         流媒体全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       sane
// @match        https://www.douyu.com/topic/*
// @match        https://www.douyu.com/*
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // 首次点击判断
    var firstClick = true;
    // 当前一级域名
    var host = window.location.hostname.split('.').slice(-2).join('.');

    const hostMapping = {
        "douyu.com": { "func": "observe", "param": "douyuAuto" },
        "bilibili.com": { "func": "timeout", "param": "bilibiliAuto" },
    };

    function observe(func) {
        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type != 'childList' && !firstClick) {
                    return;
                }

                const result = func()
                if (result) {
                    firstClick = null;
                    console.log('sane click');
                }
            });
        });

        // Start observing the target node for configured mutations
        observer.observe(document.body, { childList: true, subtree: true });

        // 执行完成后移除监听
        setTimeout(function () {
            observer.disconnect();
        }, 12000);
    }

    function timeout(func) {
        setTimeout(function () {
            func();
            firstClick = null;
            console.log('sane click');
        }, 1200);
    }

    function douyuAuto() {
        var fullscreenPageButton = document.querySelector("#__h5player > div:nth-child(12) > div > div > div.right-e7ea5d > div.wfs-2a8e83");
        if (fullscreenPageButton) {
            fullscreenPageButton.click();
            fullscreenPageButton = null;

            // #bc3 >
            // document.querySelector("#bc276 > div.layout-Main > div.layout-Player > div.layout-Player-main > div.layout-Player-video > div.layout-Player-asideToggle > label")
            const slidePageButton = document.querySelector("div.layout-Main > div.layout-Player > div.layout-Player-main > div.layout-Player-video > div.layout-Player-asideToggle > label > i")
            if (slidePageButton) {
                slidePageButton.click();
            }

            return true;
        }

        return false;
    }

    function bilibiliAuto() {
        var biliPageFullButton = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web > div.bpx-player-ctrl-btn-icon.bpx-player-ctrl-web-enter")
        if (biliPageFullButton) {
            biliPageFullButton.click();
            biliPageFullButton = null;
            const videoPlayButton = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-video-perch > div > video");
            videoPlayButton.click();
        }
    }

    const autoScriptFuncName = hostMapping[host];
    if (autoScriptFuncName) {
        eval(autoScriptFuncName["func"] + '(' + autoScriptFuncName['param'] +')');
    }
})();