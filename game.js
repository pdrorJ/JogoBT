import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const SUPABASE_URL = 'https://gtakgyndvtebzpndorrm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0YWtneW5kdnRlYnpwbmRvcnJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwOTcwNDcsImV4cCI6MjA5MjY3MzA0N30.HaRS1kLcuvlZXDj-hyFdtWZL5ICWS1mI3gK4wrIz3Sg';

window.__supabaseCreateClient = createClient;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js');
  });
}

document.addEventListener('DOMContentLoaded', () => {
            let serverPoints = 0;
            let receiverPoints = 0;
            let serverGames = 0;
            let receiverGames = 0;
            let isSinglePlayer = false;
            let currentTurn = 'SERVER';
            let serverChoice = null;
            let receiverChoice = null;
            let isGameOver = false;
            let gameMode = 'classic';

            let timingPos = 0;
            let timingDirection = 1;
            let timingInterval = null;
            let zonesTop = 0;
            let easyHeight = 250;
            let hardHeight = 140;
            let perfectHeight = 35;
            let timingResult = 'ERROU';
            let lastTimingResult = 'ERROU';

            let ballCrossedNet = false;
            let perfectTimingReception = false;

            const landingScreen = document.getElementById('landing-screen');
            const landingModeClassicBtn = document.getElementById('landing-mode-classic');
            const landingMode2Btn = document.getElementById('landing-mode-2');
            const landingMode3Btn = document.getElementById('landing-mode-3');

            const menuScreen = document.getElementById('menu-screen');
            const gameScreen = document.getElementById('game-screen');
            const startBtn = document.getElementById('start-game-btn');
            const singlePlayerToggle = document.getElementById('single-player-toggle');
            const onlineToggleBtn = document.getElementById('online-toggle-btn');
            const onlineSetupEl = document.getElementById('online-setup');
            const onlineRoomInput = document.getElementById('online-room-code');
            const onlineCreateRoomBtn = document.getElementById('online-create-room');
            const onlineJoinRoomBtn = document.getElementById('online-join-room');
            const onlineConfigBtn = document.getElementById('online-config-btn');
            const onlineLeaveBtn = document.getElementById('online-leave-btn');
            const onlineStatusEl = document.getElementById('online-status');
            const dirBtns = document.querySelectorAll('.dir-btn');
            const serveBtn = document.getElementById('process-turn-btn');
            const receptionBtn = document.getElementById('hit-reception-btn');
            const nextBtn = document.getElementById('next-point-btn');
            const backMenuBtn = document.getElementById('back-menu-btn');

            const turnIndicator = document.getElementById('turn-indicator');
            const turnStatusEl = document.getElementById('turn-status');
            const serverScoreEl = document.getElementById('server-score');
            const receiverScoreEl = document.getElementById('receiver-score');
            const serverGamesEl = document.getElementById('server-games');
            const receiverGamesEl = document.getElementById('receiver-games');

            const timingMeterContainer = document.getElementById('timing-meter-container');
            const timingRacket = document.getElementById('timing-racket');
            const zoneEasy = document.getElementById('zone-easy');
            const zoneHard = document.getElementById('zone-hard');
            const zonePerfect = document.getElementById('zone-perfect');

            const serverChar = document.getElementById('server-char');
            const receiverChar = document.getElementById('receiver-char');
            const ball = document.getElementById('game-ball');
            const fps3dLayer = document.getElementById('fps3d-layer');
            const fps3dBallEl = document.getElementById('fps3d-ball');
            const fps3dRacketEl = document.getElementById('fps3d-racket');
            const fps3dNowEl = document.getElementById('fps3d-now');
            const fps3dOpponentEl = document.getElementById('fps3d-opponent');
            const modal = document.getElementById('result-modal');
            const resultTitle = document.getElementById('result-title');
            const resultText = document.getElementById('result-text');
            const modalStars = Array.from(document.querySelectorAll('.stars-header .star'));
            const playerNameEls = Array.from(document.querySelectorAll('.score-card .player-name'));
            const pongPlayerPaddle = document.getElementById('pong-player');
            const pongAiPaddle = document.getElementById('pong-ai');
            const pongShadowEl = document.getElementById('pong-shadow');
            const pongStarEl = document.getElementById('pong-star');
            const pongStaminaEl = document.getElementById('pong-stamina');
            const pongStaminaFillEl = document.getElementById('pong-stamina-fill');
            const courtEl = document.querySelector('.court');
            const dirBtnClassicLabels = ['ESQUERDA', 'MEIO', 'DIREITA'];
            let pongPlayerPoints = 0;
            let pongAiPoints = 0;
            let pongLoopId = null;
            let pongLastFrame = 0;
            let pongBallX = 0;
            let pongBallY = 0;
            let pongBallVX = 0;
            let pongBallVY = 0;
            let pongBallZ = 0;
            let pongBallZV = 0;
            let pongCurveAmp = 0;
            let pongCurvePhase = 0;
            let pongHitStopUntil = 0;
            let pongAwaitingHit = false;
            let pongHitPhase = 'none';
            let pongAutoHitTimeout = null;
            let pongPlayerY = 0;
            let pongKeyUp = false;
            let pongKeyDown = false;
            let pongAiY = 0;
            let pongCharging = false;
            let pongChargeStart = 0;
            let pongStamina = 100;
            let pongFatigueUntil = 0;
            let pongAiNerfUntil = 0;
            let pongStarActive = false;
            let pongStarY = 0;

            let classicCharging = false;
            let classicChargeStart = 0;
            let classicPowerNorm = 0;
            let classicShotType = 'FLAT';

            let fps3dPlayerPoints = 0;
            let fps3dAiPoints = 0;
            let fps3dLoopId = null;
            let fps3dLastTs = 0;
            let fps3dStartTs = 0;
            let fps3dApproachMs = 1400;
            let fps3dT = 0;
            let fps3dState = 'idle';
            let fps3dFrom = { x: 0, y: 0 };
            let fps3dTo = { x: 0, y: 0 };
            let fps3dRacket = { x: 0, y: 0 };
            const fps3dPerfectStart = 0.82;
            const fps3dPerfectEnd = 0.94;
            const fps3dHardStart = 0.70;
            const fps3dHardEnd = 0.97;
            const fps3dEasyStart = 0.60;
            const fps3dEasyEnd = 0.995;
            let fps3dPerfectPrev = false;
            let fps3dBounceCount = 2;
            let fps3dBounceAmpMul = 0.07;
            let fps3dCurveAmp = 0;
            let fps3dCurveFreq = 2;
            let fps3dCurvePhase = 0;

            const scoreMap = { 0: '0', 1: '15', 2: '30', 3: '40' };

            let onlineEnabled = false;
            let onlineRole = null;
            let onlineRoomCode = null;
            let onlinePlayerId = null;
            let onlinePeerCount = 0;
            let onlineGameStarted = false;
            let onlinePendingStart = false;
            let onlinePeers = new Map();
            let onlineHelloInterval = null;
            let onlineJoinInterval = null;
            let onlineIsCreator = false;
            let onlineHostId = null;
            let onlineAttackDefenseMode = false;
            let onlineAttackerRole = 'SERVER';
            let onlineRound = 0;
            let onlinePendingMove = null;
            let onlinePendingGuess = null;
            let onlineResolving = false;
            let onlineQueuedRound = null;
            let onlineQueuedAttackerRole = null;
            let onlineScoreFlash = null;
            let onlineLastSentMove = null;
            let onlineLastSentGuess = null;
            let onlineResendInterval = null;
            let onlineLastResult = null;
            let supabaseClient = null;
            let supabaseChannel = null;

            function clamp01(v) {
                return Math.max(0, Math.min(1, v));
            }

            function getShotTypeFromChargeMs(ms) {
                if (ms <= 220) return 'TOPSPIN';
                if (ms <= 900) return 'FLAT';
                return 'SLICE';
            }

            function getPowerNormFromChargeMs(ms) {
                return clamp01(ms / 1500);
            }

            function getStarsForTimingResult(result) {
                if (result === 'PERFEITO') return 3;
                if (result === 'DIFÍCIL') return 2;
                if (result === 'FÁCIL') return 1;
                return 0;
            }

            function renderStars(starsCount) {
                modalStars.forEach((starEl, idx) => {
                    starEl.classList.toggle('off', idx >= starsCount);
                });
            }

            function showResultModal(title, message, starsCount) {
                renderStars(starsCount);
                resultTitle.textContent = title;
                resultText.innerHTML = message;
                setTimeout(() => {
                    modal.classList.remove('hidden');
                }, 1200);
            }

            function fps3dOpponentSwing() {
                if (!fps3dOpponentEl) return;
                fps3dOpponentEl.classList.remove('swing');
                void fps3dOpponentEl.offsetWidth;
                fps3dOpponentEl.classList.add('swing');
                setTimeout(() => fps3dOpponentEl.classList.remove('swing'), 360);
            }

            function openMenu() {
                landingScreen.classList.add('hidden');
                menuScreen.classList.remove('hidden');
                gameScreen.classList.add('hidden');
            }

            function setOnlineStatus(text) {
                onlineStatusEl.textContent = text;
            }

            function setTurnStatus(text, mode) {
                if (!turnStatusEl) return;
                const t = (text || '').trim();
                if (!t) {
                    turnStatusEl.textContent = '';
                    turnStatusEl.style.display = 'none';
                    return;
                }
                turnStatusEl.style.display = 'block';
                turnStatusEl.textContent = t;

                const attack = '#2fff8f';
                const defense = '#ff4fd8';
                const wait = '#2fe6d2';
                const color = mode === 'attack' ? attack : (mode === 'defense' ? defense : wait);
                turnStatusEl.style.marginTop = '10px';
                turnStatusEl.style.padding = '10px 12px';
                turnStatusEl.style.borderRadius = '14px';
                turnStatusEl.style.fontWeight = '800';
                turnStatusEl.style.letterSpacing = '0.5px';
                turnStatusEl.style.textAlign = 'center';
                turnStatusEl.style.color = color;
                turnStatusEl.style.border = `1px solid ${color}55`;
                turnStatusEl.style.background = `linear-gradient(180deg, rgba(15, 24, 46, 0.78), rgba(10, 14, 26, 0.92))`;
                turnStatusEl.style.boxShadow = `0 0 0 1px rgba(255,255,255,0.06) inset, 0 10px 28px rgba(0,0,0,0.45), 0 0 22px ${color}44`;
            }

            function pulseTurnStatus() {
                if (!turnStatusEl) return;
                turnStatusEl.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    if (!turnStatusEl) return;
                    turnStatusEl.style.transform = 'scale(1)';
                }, 220);
            }

            function normalizeRoomCode(raw) {
                return (raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
            }

            function randomRoomCode() {
                const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                let out = '';
                for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
                return out;
            }

            function normalizeSupabaseUrl(raw) {
                const v = (raw || '').trim();
                if (!v) return '';
                const candidate = (/^https?:\/\//i.test(v) ? v : `https://${v}`);
                try {
                    const u = new URL(candidate);
                    return u.origin;
                } catch {
                    return '';
                }
            }

            function isLikelyJwt(token) {
                const t = (token || '').trim();
                if (!t) return false;
                if (!t.startsWith('eyJ')) return false;
                return t.split('.').length === 3;
            }

            function getSupabaseConfig() {
                const embeddedUrl = normalizeSupabaseUrl(SUPABASE_URL);
                const embeddedAnon = (SUPABASE_ANON_KEY || '').trim();
                if (embeddedUrl && embeddedAnon) return { url: embeddedUrl, anon: embeddedAnon };

                const url = normalizeSupabaseUrl(localStorage.getItem('bt_supabase_url'));
                const anon = (localStorage.getItem('bt_supabase_anon') || '').trim();
                if (!url || !anon) return null;
                return { url, anon };
            }

            function configureSupabase() {
                setOnlineStatus('Supabase: configuração interna. Preencha SUPABASE_URL e SUPABASE_ANON_KEY em game.js.');
                return null;
            }

            function ensureSupabase() {
                if (supabaseClient) return supabaseClient;
                const createClient = window.__supabaseCreateClient;
                if (typeof createClient !== 'function') {
                    setOnlineStatus('Supabase não carregou (sem internet ou bloqueio).');
                    return null;
                }
                const cfg = getSupabaseConfig();
                if (!cfg) {
                    configureSupabase();
                    return null;
                }

                if (location.protocol === 'file:') {
                    setOnlineStatus('Abra via http://localhost (Live Server) para usar o modo Online.');
                    return null;
                }

                if (cfg.anon.startsWith('sb_publishable_') || cfg.anon.startsWith('sb_secret_')) {
                    setOnlineStatus('Chave errada. Use a "anon public" (JWT que começa com eyJ...) do Supabase em SUPABASE_ANON_KEY.');
                    return null;
                }

                try {
                    supabaseClient = createClient(cfg.url, cfg.anon);
                } catch {
                    supabaseClient = null;
                    localStorage.removeItem('bt_supabase_url');
                    localStorage.removeItem('bt_supabase_anon');
                    setOnlineStatus('URL/ANON inválidos. Preencha SUPABASE_URL e SUPABASE_ANON_KEY em game.js.');
                    return null;
                }

                if (!isLikelyJwt(cfg.anon)) {
                    setOnlineStatus('Aviso: SUPABASE_ANON_KEY não parece uma anon key (JWT). Se ficar em "Conectando...", troque pela "anon public" do Supabase (começa com eyJ...).');
                }
                return supabaseClient;
            }

            function classicUpdateOnlineAccess() {
                if (!onlineEnabled || gameMode !== 'classic') {
                    setTurnStatus('');
                    dirBtns.forEach(b => { b.disabled = false; });
                    serveBtn.disabled = false;
                    receptionBtn.disabled = false;
                    nextBtn.disabled = false;
                    return;
                }

                if (onlineAttackDefenseMode) {
                    serveBtn.classList.add('hidden');
                    receptionBtn.classList.add('hidden');
                    serveBtn.disabled = true;
                    receptionBtn.disabled = true;
                    nextBtn.disabled = false;

                    const iAmAttacker = onlineRole === onlineAttackerRole;
                    const canAttack = iAmAttacker && !onlineResolving && onlinePendingMove === null;
                    const canDefend = (!iAmAttacker) && !onlineResolving && onlinePendingMove !== null && onlinePendingGuess === null;
                    dirBtns.forEach(b => { b.disabled = !(canAttack || canDefend); });

                    if (iAmAttacker) {
                        if (onlinePendingMove === null) {
                            turnIndicator.textContent = 'ATAQUE';
                            setTurnStatus('Sua vez de atacar', 'attack');
                        } else {
                            turnIndicator.textContent = 'ATAQUE';
                            setTurnStatus('Aguardando defesa...', 'attack');
                        }
                    } else {
                        if (onlinePendingMove === null) {
                            turnIndicator.textContent = 'DEFESA';
                            setTurnStatus('Aguardando ataque...', 'defense');
                        } else if (onlinePendingGuess === null) {
                            turnIndicator.textContent = 'DEFESA';
                            setTurnStatus('Sua vez de defender', 'defense');
                        } else {
                            turnIndicator.textContent = 'DEFESA';
                            setTurnStatus('Aguardando resultado...', 'wait');
                        }
                    }
                    return;
                }

                const canChooseDir = (onlineRole === currentTurn) && (currentTurn === 'SERVER' || currentTurn === 'RECEIVER');
                setTurnStatus('');
                dirBtns.forEach(b => { b.disabled = !canChooseDir; });
                const canServe = onlineRole === 'SERVER' && currentTurn === 'READY';
                serveBtn.disabled = !canServe;
                const canReception = onlineRole === 'RECEIVER';
                receptionBtn.disabled = !canReception;
                const canNext = onlineRole === 'SERVER';
                nextBtn.disabled = !canNext;
                if (onlineRole !== 'RECEIVER') {
                    receptionBtn.classList.add('hidden');
                }
            }

            function onlineSendEvent(eventName, payload) {
                if (!supabaseChannel) return;
                const enriched = { ...(payload || {}), from: onlinePlayerId, at: Date.now() };
                supabaseChannel.send({ type: 'broadcast', event: eventName, payload: enriched });
            }

            function onlineBroadcast(payload) {
                onlineSendEvent('classic', payload);
            }

            function onlineRecomputeFromPeers() {
                const now = Date.now();
                for (const [id, peer] of onlinePeers.entries()) {
                    if (now - (peer.lastSeen || 0) > 20000) {
                        onlinePeers.delete(id);
                    }
                }
                onlinePeerCount = onlinePeers.size;
                if (onlineHostId) {
                    onlineRole = (onlinePlayerId && onlinePlayerId === onlineHostId) ? 'SERVER' : 'RECEIVER';
                    return;
                }
                onlineRole = onlineIsCreator ? 'SERVER' : 'RECEIVER';
            }

            function onlineApplyState(state) {
                if (!state) return;
                serverPoints = state.serverPoints ?? serverPoints;
                receiverPoints = state.receiverPoints ?? receiverPoints;
                serverGames = state.serverGames ?? serverGames;
                receiverGames = state.receiverGames ?? receiverGames;
                currentTurn = state.currentTurn ?? currentTurn;
                isGameOver = state.isGameOver ?? isGameOver;
                lastTimingResult = state.lastTimingResult ?? lastTimingResult;
                if (state.nextBtnText) nextBtn.textContent = state.nextBtnText;
                updateUI();
                classicUpdateOnlineAccess();
            }

            function onlineEnsureResendLoop() {
                if (onlineResendInterval) return;
                onlineResendInterval = setInterval(() => {
                    if (!onlineEnabled || !onlineAttackDefenseMode) return;
                    if (onlineResolving) return;

                    const now = Date.now();
                    const resendAfterMs = 1200;
                    const maxTries = 8;

                    if (onlineLastSentMove && onlineLastSentMove.round === onlineRound && onlinePendingMove !== null) {
                        if (now - (onlineLastSentMove.lastSentAt || 0) >= resendAfterMs && (onlineLastSentMove.tries || 0) < maxTries) {
                            onlineLastSentMove.lastSentAt = now;
                            onlineLastSentMove.tries = (onlineLastSentMove.tries || 0) + 1;
                            onlineSendEvent('player_move', { dir: onlineLastSentMove.dir, round: onlineLastSentMove.round });
                        }
                    }

                    if (onlineLastSentGuess && onlineLastSentGuess.round === onlineRound && onlinePendingGuess !== null) {
                        if (now - (onlineLastSentGuess.lastSentAt || 0) >= resendAfterMs && (onlineLastSentGuess.tries || 0) < maxTries) {
                            onlineLastSentGuess.lastSentAt = now;
                            onlineLastSentGuess.tries = (onlineLastSentGuess.tries || 0) + 1;
                            onlineSendEvent('player_guess', { dir: onlineLastSentGuess.dir, round: onlineLastSentGuess.round });
                        }
                    }

                    const waitingForResult = onlineRole !== 'SERVER' && onlinePendingMove !== null && onlinePendingGuess !== null;
                    if (waitingForResult) {
                        onlineSendEvent('result_request', { round: onlineRound });
                    }
                }, 900);
            }

            function onlineStopResendLoop() {
                if (!onlineResendInterval) return;
                clearInterval(onlineResendInterval);
                onlineResendInterval = null;
            }

            function onlineStartAttackDefenseLocal() {
                onlineAttackDefenseMode = true;
                onlineAttackerRole = 'SERVER';
                onlineRound = 0;
                onlinePendingMove = null;
                onlinePendingGuess = null;
                onlineResolving = false;
                onlineQueuedRound = null;
                onlineQueuedAttackerRole = null;
                onlineLastSentMove = null;
                onlineLastSentGuess = null;
                onlineLastResult = null;
                serverPoints = 0;
                receiverPoints = 0;
                serverGames = 0;
                receiverGames = 0;
                isGameOver = false;
                serverChar.style.left = '50%';
                receiverChar.style.left = '50%';
                timingMeterContainer.classList.add('hidden');
                serveBtn.classList.add('hidden');
                receptionBtn.classList.add('hidden');
                onlineEnsureResendLoop();
                updateUI();
                classicUpdateOnlineAccess();
            }

            function onlineAnimateAttackDefenseBall(attackerRole, dir) {
                if (!courtEl || !ball) return;
                const rect = courtEl.getBoundingClientRect();
                if (!rect.width || !rect.height) return;

                const fromIsServer = attackerRole === 'SERVER';
                const startY = fromIsServer ? (rect.height * 0.82) : (rect.height * 0.18);
                const endY = fromIsServer ? (rect.height * 0.18) : (rect.height * 0.82);
                const endX = dir === 'Left' ? (rect.width * 0.22) : (dir === 'Right' ? (rect.width * 0.78) : (rect.width * 0.50));
                const startX = rect.width * 0.50;
                const dur = 520;
                const startAt = performance.now();
                ball.classList.remove('hidden');
                ball.style.transition = 'none';

                function frame(now) {
                    const t = Math.min(1, (now - startAt) / dur);
                    const ease = t < 0.5 ? (2 * t * t) : (1 - Math.pow(-2 * t + 2, 2) / 2);
                    const x = startX + (endX - startX) * ease;
                    const y = startY + (endY - startY) * ease;
                    ball.style.left = `${(x / rect.width) * 100}%`;
                    ball.style.top = `${(y / rect.height) * 100}%`;
                    if (t < 1) requestAnimationFrame(frame);
                }

                requestAnimationFrame(frame);
            }

            function onlineTryResolveAttackDefense() {
                if (onlineRole !== 'SERVER') return;
                if (!onlineAttackDefenseMode) return;
                if (onlineResolving) return;
                if (onlinePendingMove === null || onlinePendingGuess === null) return;

                onlineResolving = true;
                const defended = onlinePendingMove === onlinePendingGuess;
                const scorerRole = defended ? (onlineAttackerRole === 'SERVER' ? 'RECEIVER' : 'SERVER') : onlineAttackerRole;
                let serverPointsNext = serverPoints;
                let receiverPointsNext = receiverPoints;
                let serverGamesNext = serverGames;
                let receiverGamesNext = receiverGames;
                let gameWon = false;

                if (scorerRole === 'SERVER') {
                    if (serverPointsNext < 3) {
                        serverPointsNext += 1;
                    } else {
                        serverGamesNext += 1;
                        serverPointsNext = 0;
                        receiverPointsNext = 0;
                        gameWon = true;
                    }
                } else {
                    if (receiverPointsNext < 3) {
                        receiverPointsNext += 1;
                    } else {
                        receiverGamesNext += 1;
                        serverPointsNext = 0;
                        receiverPointsNext = 0;
                        gameWon = true;
                    }
                }
                const attackerRoleNext = onlineAttackerRole === 'SERVER' ? 'RECEIVER' : 'SERVER';

                const result = {
                    round: onlineRound,
                    attackerRole: onlineAttackerRole,
                    move: onlinePendingMove,
                    guess: onlinePendingGuess,
                    defended,
                    scorerRole,
                    serverPoints: serverPointsNext,
                    receiverPoints: receiverPointsNext,
                    serverGames: serverGamesNext,
                    receiverGames: receiverGamesNext,
                    gameWon,
                    attackerRoleNext
                };

                onlineLastResult = result;
                onlineApplyAttackDefenseResult(result);
                onlineSendEvent('round_result', result);
            }

            function onlineApplyAttackDefenseResult(payload) {
                if (!payload) return;
                if (!onlineAttackDefenseMode) return;
                if (typeof payload.round === 'number' && payload.round !== onlineRound) return;

                serverPoints = payload.serverPoints ?? serverPoints;
                receiverPoints = payload.receiverPoints ?? receiverPoints;
                serverGames = payload.serverGames ?? serverGames;
                receiverGames = payload.receiverGames ?? receiverGames;
                if (payload.gameWon && payload.scorerRole) {
                    onlineScoreFlash = { scorerRole: payload.scorerRole, until: Date.now() + 5000 };
                } else {
                    onlineScoreFlash = null;
                }
                updateUI();

                onlineResolving = true;
                onlinePendingMove = null;
                onlinePendingGuess = null;
                onlineLastSentMove = null;
                onlineLastSentGuess = null;
                onlineQueuedRound = null;
                onlineQueuedAttackerRole = null;
                if (typeof payload.round === 'number') {
                    onlineRound = payload.round + 1;
                }
                if (payload.attackerRoleNext) {
                    onlineAttackerRole = payload.attackerRoleNext;
                }

                onlineAnimateAttackDefenseBall(payload.attackerRole, payload.move);

                const youScored = payload.scorerRole === onlineRole;
                const title = payload.gameWon ? 'GAME!' : (payload.defended ? 'DEFESA!' : 'PONTO!');
                const message = payload.defended
                    ? (payload.gameWon
                        ? (youScored ? 'Defesa realizada! Você fechou o game.' : 'Defesa realizada! Game do defensor.')
                        : (youScored ? 'Defesa realizada! Você pontuou.' : 'Defesa realizada! Ponto do defensor.'))
                    : (payload.gameWon
                        ? (youScored ? 'Ataque perfeito! Você fechou o game.' : 'Ataque passou! Game do atacante.')
                        : (youScored ? 'Ataque perfeito! Você pontuou.' : 'Ataque passou! Ponto do atacante.'));
                showResultModal(title, message, payload.defended ? 3 : 1);

                classicUpdateOnlineAccess();
            }

            function onlineOnPlayerMove(payload) {
                if (!payload) return;
                if (!onlineAttackDefenseMode) return;
                if (payload.from && payload.from === onlinePlayerId) return;
                if (typeof payload.round === 'number' && payload.round !== onlineRound) return;
                if (typeof payload.dir !== 'string') return;
                onlinePendingMove = payload.dir;
                if (payload.from) {
                    onlineSendEvent('input_ack', { kind: 'move', round: payload.round, to: payload.from });
                }
                const attackerChar = onlineAttackerRole === 'SERVER' ? serverChar : receiverChar;
                moveCharacter(attackerChar, payload.dir);
                if (onlineRole !== onlineAttackerRole) {
                    pulseTurnStatus();
                    setTurnStatus('Bola lançada! Sua vez de defender', 'defense');
                }
                classicUpdateOnlineAccess();
                onlineTryResolveAttackDefense();
            }

            function onlineOnPlayerGuess(payload) {
                if (!payload) return;
                if (!onlineAttackDefenseMode) return;
                if (payload.from && payload.from === onlinePlayerId) return;
                if (typeof payload.round === 'number' && payload.round !== onlineRound) return;
                if (typeof payload.dir !== 'string') return;
                if (onlineRole === 'SERVER') {
                    onlinePendingGuess = payload.dir;
                    if (payload.from) {
                        onlineSendEvent('input_ack', { kind: 'guess', round: payload.round, to: payload.from });
                    }
                }
                const defenderRole = onlineAttackerRole === 'SERVER' ? 'RECEIVER' : 'SERVER';
                const defenderChar = defenderRole === 'SERVER' ? serverChar : receiverChar;
                moveCharacter(defenderChar, payload.dir);
                classicUpdateOnlineAccess();
                onlineTryResolveAttackDefense();
            }

            function onlineHandleClassicMessage(msg) {
                if (!msg) return;
                if (msg.from && msg.from === onlinePlayerId) return;

                if (msg.type === 'start') {
                    if (!onlineEnabled || !onlineRole) {
                        onlinePendingStart = true;
                        return;
                    }
                    onlinePendingStart = false;
                    onlineGameStarted = true;
                    gameMode = 'classic';
                    isSinglePlayer = false;
                    startClassicMatchLocal();
                    onlineStartAttackDefenseLocal();
                    return;
                }

                if (onlineAttackDefenseMode) return;

                if (gameMode !== 'classic') return;

                if (msg.type === 'sync') {
                    onlineApplyState(msg.state);
                    return;
                }

                if (msg.type === 'choice') {
                    if (msg.turn === 'SERVER') {
                        serverChoice = msg.choice;
                        moveCharacter(serverChar, msg.choice);
                        currentTurn = 'RECEIVER';
                        turnIndicator.textContent = 'VEZ DO RECEBEDOR';
                        dirBtns.forEach(b => b.classList.remove('selected'));
                        classicUpdateOnlineAccess();
                        return;
                    }
                    if (msg.turn === 'RECEIVER') {
                        receiverChoice = msg.choice;
                        moveCharacter(receiverChar, msg.choice);
                        currentTurn = 'READY';
                        turnIndicator.textContent = 'SACADOR: CLIQUE EM SACAR PARA PARAR A BARRA!';
                        if (onlineRole === 'SERVER') {
                            serveBtn.classList.remove('hidden');
                            serveBtn.textContent = 'SACAR!';
                            startTimingMeter();
                        } else {
                            serveBtn.classList.add('hidden');
                            timingMeterContainer.classList.add('hidden');
                        }
                        classicUpdateOnlineAccess();
                        return;
                    }
                }

                if (msg.type === 'serve') {
                    clearInterval(timingInterval);
                    timingInterval = null;
                    timingMeterContainer.classList.add('hidden');
                    timingResult = msg.timingResult || 'ERROU';
                    lastTimingResult = timingResult;
                    serveBtn.classList.add('hidden');
                    currentTurn = 'PLAYING';
                    playAnimation();
                    classicUpdateOnlineAccess();
                    return;
                }

                if (msg.type === 'reception') {
                    perfectTimingReception = true;
                    receptionBtn.classList.add('hidden');
                    createCounterAttackEffect();
                    return;
                }

                if (msg.type === 'result') {
                    if (msg.state) onlineApplyState(msg.state);
                    if (msg.shake) triggerScreenShake();
                    if (msg.winner) createSandParticles(msg.winner);
                    if (msg.modal) {
                        showResultModal(msg.modal.title || 'RESULTADO', msg.modal.message || '', msg.modal.starsCount || 0);
                    }
                    return;
                }

                if (msg.type === 'next') {
                    modal.classList.add('hidden');
                    resetPoint();
                    classicUpdateOnlineAccess();
                    return;
                }
            }

            async function onlineDisconnect() {
                onlineEnabled = false;
                onlineRole = null;
                onlineRoomCode = null;
                onlinePeerCount = 0;
                onlineGameStarted = false;
                onlinePendingStart = false;
                onlinePeers = new Map();
                onlineHostId = null;
                onlineIsCreator = false;
                onlineAttackDefenseMode = false;
                onlineAttackerRole = 'SERVER';
                onlineRound = 0;
                onlinePendingMove = null;
                onlinePendingGuess = null;
                onlineResolving = false;
                onlineQueuedRound = null;
                onlineQueuedAttackerRole = null;
                onlineScoreFlash = null;
                onlineLastSentMove = null;
                onlineLastSentGuess = null;
                onlineLastResult = null;
                onlineStopResendLoop();
                if (onlineHelloInterval) {
                    clearInterval(onlineHelloInterval);
                    onlineHelloInterval = null;
                }
                if (onlineJoinInterval) {
                    clearInterval(onlineJoinInterval);
                    onlineJoinInterval = null;
                }
                if (supabaseChannel) {
                    await supabaseChannel.unsubscribe();
                    supabaseChannel = null;
                }
                singlePlayerToggle.disabled = false;
                startBtn.textContent = 'JOGAR';
                startBtn.disabled = false;
                setOnlineStatus('Desligado.');
                classicUpdateOnlineAccess();
            }

            async function onlineConnectToRoom(roomCode, isCreator) {
                const sb = ensureSupabase();
                if (!sb) return;
                await onlineDisconnect();

                onlineRoomCode = normalizeRoomCode(roomCode);
                if (!onlineRoomCode) {
                    setOnlineStatus('Digite um código (ou crie uma sala).');
                    return;
                }

                onlinePlayerId = (window.crypto?.randomUUID?.() || `p_${Math.random().toString(16).slice(2)}_${Date.now()}`);
                onlineIsCreator = !!isCreator;
                onlineHostId = onlineIsCreator ? onlinePlayerId : null;
                onlineRecomputeFromPeers();
                setOnlineStatus(`Conectando na sala ${onlineRoomCode}...`);

                try {
                    sb.realtime.connect();
                } catch {
                }

                const ch = sb.channel(`bt_classic_${onlineRoomCode}`, { config: { presence: { key: onlinePlayerId } } });
                supabaseChannel = ch;

                ch.on('presence', { event: 'sync' }, () => {
                    const state = ch.presenceState();
                    const now = Date.now();
                    const peerKeys = Object.keys(state);
                    for (const id of peerKeys) {
                        const prev = onlinePeers.get(id) || {};
                        onlinePeers.set(id, { ...prev, lastSeen: now });
                    }
                    onlineRecomputeFromPeers();

                    if (onlinePeerCount > 2) {
                        setOnlineStatus(`Sala cheia (${onlinePeerCount}). Use outro código.`);
                        return;
                    }

                    if (onlinePeerCount === 0) {
                        setOnlineStatus(`Conectado na sala ${onlineRoomCode}. Aguardando...`);
                        return;
                    }

                    onlineEnabled = true;
                    singlePlayerToggle.checked = false;
                    singlePlayerToggle.disabled = true;

                    if (onlinePeerCount === 1) {
                        setOnlineStatus(`Sala ${onlineRoomCode}: esperando outro jogador...`);
                    } else {
                        setOnlineStatus(`Sala ${onlineRoomCode}: conectado!`);
                    }
                    startBtn.disabled = true;
                    startBtn.textContent = 'AGUARDANDO...';
                    classicUpdateOnlineAccess();
                });

                ch.on('broadcast', { event: 'hello' }, ({ payload }) => {
                    if (!payload) return;
                    const now = Date.now();
                    const id = payload.from || payload.playerId;
                    if (!id) return;
                    const prev = onlinePeers.get(id) || {};
                    onlinePeers.set(id, { ...prev, lastSeen: payload.at || now });
                    onlineRecomputeFromPeers();
                });

                ch.on('broadcast', { event: 'host_announce' }, ({ payload }) => {
                    if (!payload) return;
                    const hostId = payload.hostId;
                    if (!hostId) return;
                    onlineHostId = hostId;
                    onlineRecomputeFromPeers();
                    onlineEnabled = true;
                    singlePlayerToggle.checked = false;
                    singlePlayerToggle.disabled = true;
                    if (!onlineIsCreator) {
                        setOnlineStatus(`Sala ${onlineRoomCode}: conectado!`);
                        startBtn.disabled = true;
                        startBtn.textContent = 'AGUARDANDO...';
                        onlineSendEvent('join_request', { playerId: onlinePlayerId });
                    }
                    classicUpdateOnlineAccess();
                });

                ch.on('broadcast', { event: 'join_request' }, ({ payload }) => {
                    if (!payload) return;
                    const joinerId = payload.playerId || payload.from;
                    if (!joinerId) return;
                    if (!onlineIsCreator) return;
                    if (joinerId === onlinePlayerId) return;
                    const prev = onlinePeers.get(joinerId) || {};
                    onlinePeers.set(joinerId, { ...prev, lastSeen: payload.at || Date.now() });
                    onlineRecomputeFromPeers();
                    onlineEnabled = true;
                    singlePlayerToggle.checked = false;
                    singlePlayerToggle.disabled = true;
                    setOnlineStatus(`Sala ${onlineRoomCode}: jogador entrou! Iniciando...`);
                    startBtn.disabled = true;
                    startBtn.textContent = 'INICIANDO...';
                    onlineSendEvent('join_ack', { hostId: onlinePlayerId, to: joinerId, startNow: true });
                    if (!onlineGameStarted) {
                        onlineGameStarted = true;
                        onlinePendingStart = false;
                        onlineBroadcast({ type: 'start' });
                        startClassicMatchLocal();
                        onlineStartAttackDefenseLocal();
                    }
                    classicUpdateOnlineAccess();
                });

                ch.on('broadcast', { event: 'join_ack' }, ({ payload }) => {
                    if (!payload) return;
                    const to = payload.to;
                    if (to && to !== onlinePlayerId) return;
                    if (payload.hostId) {
                        onlineHostId = payload.hostId;
                        onlineRecomputeFromPeers();
                    }
                    onlineEnabled = true;
                    singlePlayerToggle.checked = false;
                    singlePlayerToggle.disabled = true;
                    setOnlineStatus(`Sala ${onlineRoomCode}: conectado! Aguardando início...`);
                    startBtn.disabled = true;
                    startBtn.textContent = 'AGUARDANDO...';
                    if (payload.startNow && !onlineGameStarted) {
                        onlineGameStarted = true;
                        onlinePendingStart = false;
                        startClassicMatchLocal();
                        onlineStartAttackDefenseLocal();
                    }
                    classicUpdateOnlineAccess();
                });

                ch.on('broadcast', { event: 'classic' }, ({ payload }) => {
                    onlineHandleClassicMessage(payload);
                });

                ch.on('broadcast', { event: 'player_move' }, ({ payload }) => {
                    onlineOnPlayerMove(payload);
                });

                ch.on('broadcast', { event: 'player_guess' }, ({ payload }) => {
                    onlineOnPlayerGuess(payload);
                });

                ch.on('broadcast', { event: 'round_result' }, ({ payload }) => {
                    if (!payload) return;
                    if (payload.from && payload.from === onlinePlayerId) return;
                    onlineApplyAttackDefenseResult(payload);
                });

                ch.on('broadcast', { event: 'input_ack' }, ({ payload }) => {
                    if (!payload) return;
                    const to = payload.to;
                    if (to && to !== onlinePlayerId) return;
                    if (payload.kind === 'move' && onlineLastSentMove && payload.round === onlineLastSentMove.round) {
                        onlineLastSentMove = null;
                        return;
                    }
                    if (payload.kind === 'guess' && onlineLastSentGuess && payload.round === onlineLastSentGuess.round) {
                        onlineLastSentGuess = null;
                    }
                });

                ch.on('broadcast', { event: 'result_request' }, ({ payload }) => {
                    if (!payload) return;
                    if (!onlineAttackDefenseMode) return;
                    if (onlineRole !== 'SERVER') return;
                    const r = payload.round;
                    if (typeof r !== 'number') return;
                    if (onlineLastResult && onlineLastResult.round === r) {
                        onlineSendEvent('round_result', onlineLastResult);
                    }
                });

                const status = await Promise.race([
                    new Promise((resolve) => {
                        ch.subscribe((s) => {
                            setOnlineStatus(`Conectando na sala ${onlineRoomCode}... (${s})`);
                            resolve(s);
                        });
                    }),
                    new Promise((resolve) => setTimeout(() => resolve('TIMED_OUT'), 9000))
                ]);

                if (status !== 'SUBSCRIBED') {
                    if (status === 'TIMED_OUT') {
                        setOnlineStatus('Tempo esgotado ao conectar. Verifique se Realtime está habilitado no Supabase e se a chave permite Realtime.');
                    } else {
                        setOnlineStatus(`Falha ao entrar na sala (${status}).`);
                    }
                    await onlineDisconnect();
                    return;
                }

                onlinePeers = new Map([[onlinePlayerId, { lastSeen: Date.now() }]]);
                onlineRecomputeFromPeers();
                setOnlineStatus(onlineIsCreator
                    ? `Conectado na sala ${onlineRoomCode}. Aguardando outro jogador...`
                    : `Conectado na sala ${onlineRoomCode}. Procurando host...`);
                startBtn.disabled = true;
                startBtn.textContent = 'AGUARDANDO...';

                if (onlineHelloInterval) clearInterval(onlineHelloInterval);
                onlineHelloInterval = setInterval(() => {
                    onlineSendEvent('hello', { playerId: onlinePlayerId });
                }, 1500);
                onlineSendEvent('hello', { playerId: onlinePlayerId });

                if (onlineIsCreator) {
                    onlineSendEvent('host_announce', { hostId: onlinePlayerId });
                } else {
                    if (onlineJoinInterval) clearInterval(onlineJoinInterval);
                    onlineJoinInterval = setInterval(() => {
                        if (onlineGameStarted) return;
                        onlineSendEvent('join_request', { playerId: onlinePlayerId });
                    }, 1500);
                    onlineSendEvent('join_request', { playerId: onlinePlayerId });
                }

                try {
                    await ch.track({ joinedAt: Date.now() });
                } catch {
                }
            }

            function backToLanding() {
                clearInterval(timingInterval);
                timingInterval = null;
                timingMeterContainer.classList.add('hidden');
                modal.classList.add('hidden');

                pongStopLoop();
                clearTimeout(pongAutoHitTimeout);
                pongAutoHitTimeout = null;

                fps3dStop();
                fps3dLayer.classList.add('hidden');
                fps3dBallEl.classList.add('hidden');
                fps3dRacketEl.classList.add('hidden');
                fps3dNowEl.classList.add('hidden');
                fps3dOpponentEl.classList.add('hidden');

                pongStaminaEl.classList.add('hidden');
                pongStarEl.classList.add('hidden');
                pongShadowEl.classList.add('hidden');
                ball.classList.add('hidden');
                ball.classList.remove('fire-trail');

                gameScreen.classList.add('hidden');
                gameScreen.classList.remove('pong-mode');
                gameScreen.classList.remove('fps3d-mode');
                menuScreen.classList.add('hidden');
                landingScreen.classList.remove('hidden');
                isGameOver = false;
                nextBtn.textContent = 'CONTINUAR';
                gameMode = 'classic';
            }

            landingModeClassicBtn.addEventListener('click', openMenu);
            landingMode3Btn.addEventListener('click', () => {
                fps3dSetUi();
                fps3dStartRally();
            });
            backMenuBtn.addEventListener('click', backToLanding);

            onlineToggleBtn.addEventListener('click', () => {
                const isOpen = !onlineSetupEl.classList.contains('hidden');
                onlineSetupEl.classList.toggle('hidden', isOpen);
                onlineToggleBtn.textContent = isOpen ? 'ABRIR' : 'FECHAR';
            });

            onlineConfigBtn.addEventListener('click', () => {
                configureSupabase();
            });

            const hasEmbeddedSupabase = !!(normalizeSupabaseUrl(SUPABASE_URL) && (SUPABASE_ANON_KEY || '').trim());
            if (hasEmbeddedSupabase) {
                onlineConfigBtn.classList.add('hidden');
                setOnlineStatus('Online pronto. Crie/entre em uma sala.');
            }

            onlineCreateRoomBtn.addEventListener('click', async () => {
                const code = randomRoomCode();
                onlineRoomInput.value = code;
                await onlineConnectToRoom(code, true);
            });

            onlineJoinRoomBtn.addEventListener('click', async () => {
                const code = normalizeRoomCode(onlineRoomInput.value);
                onlineRoomInput.value = code;
                await onlineConnectToRoom(code, false);
            });

            onlineLeaveBtn.addEventListener('click', async () => {
                await onlineDisconnect();
            });

            window.addEventListener('pointerdown', () => {
                if (gameMode === 'pong') {
                    if (!pongAwaitingHit) return;

                    const result = stopTimingMeterCore();
                    pongApplyPlayerHit(result);
                    return;
                }

                if (gameMode === 'fps3d') {
                    if (isGameOver) return;
                    if (fps3dState !== 'approaching') return;
                    fps3dHandleClickHit();
                }
            });

            window.addEventListener('pointerup', () => {
                if (gameMode === 'pong') {
                    return;
                }

                if (gameMode === 'classic') return;
            });

            window.addEventListener('pointermove', (e) => {
                if (gameMode !== 'fps3d') return;
                const rect = courtEl.getBoundingClientRect();
                const x = pongClamp(e.clientX - rect.left, 0, rect.width);
                const y = pongClamp(e.clientY - rect.top, rect.height * 0.72, rect.height * 0.94);
                fps3dRacket = { x, y };
                fps3dRacketEl.style.left = `${x}px`;
                fps3dRacketEl.style.top = `${y}px`;
            });

            window.addEventListener('keydown', (e) => {
                if (gameMode !== 'pong') return;
                const key = e.key.toLowerCase();
                if (key === 'w') {
                    pongKeyUp = true;
                    e.preventDefault();
                }
                if (key === 's') {
                    pongKeyDown = true;
                    e.preventDefault();
                }
            }, { passive: false });

            window.addEventListener('keyup', (e) => {
                if (gameMode !== 'pong') return;
                const key = e.key.toLowerCase();
                if (key === 'w') {
                    pongKeyUp = false;
                    e.preventDefault();
                }
                if (key === 's') {
                    pongKeyDown = false;
                    e.preventDefault();
                }
            }, { passive: false });

            function startClassicMatchLocal() {
                gameMode = 'classic';
                isSinglePlayer = onlineEnabled ? false : singlePlayerToggle.checked;
                menuScreen.classList.add('hidden');
                landingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                gameScreen.classList.remove('pong-mode');
                gameScreen.classList.remove('fps3d-mode');
                pongStopLoop();
                pongCharging = false;
                pongAwaitingHit = false;
                pongHitPhase = 'none';
                clearTimeout(pongAutoHitTimeout);
                pongAutoHitTimeout = null;
                pongStaminaEl.classList.add('hidden');
                pongStarEl.classList.add('hidden');
                pongShadowEl.classList.add('hidden');
                ball.classList.remove('fire-trail');
                fps3dStop();
                fps3dLayer.classList.add('hidden');
                fps3dBallEl.classList.add('hidden');
                fps3dRacketEl.classList.add('hidden');
                if (onlineEnabled) {
                    playerNameEls[0].textContent = onlineRole === 'SERVER' ? 'VOCÊ' : 'ONLINE';
                    playerNameEls[1].textContent = onlineRole === 'RECEIVER' ? 'VOCÊ' : 'ONLINE';
                } else {
                    playerNameEls[0].textContent = 'SACADOR';
                    playerNameEls[1].textContent = 'RECEBEDOR';
                }
                dirBtns.forEach((b, i) => { b.textContent = dirBtnClassicLabels[i]; });
                easyHeight = 250;
                hardHeight = 140;
                perfectHeight = 35;
                resetMatch();
                classicUpdateOnlineAccess();
            }

            startBtn.addEventListener('click', () => {
                if (onlineEnabled) {
                    if (onlineRole !== 'SERVER') {
                        setOnlineStatus('Aguarde: o SACADOR inicia a partida.');
                        return;
                    }
                    if (onlinePeerCount < 2) {
                        setOnlineStatus('Entre na sala com 2 jogadores antes de começar.');
                        return;
                    }
                    if (onlineGameStarted) return;
                    onlineGameStarted = true;
                    onlineBroadcast({ type: 'start' });
                }
                startClassicMatchLocal();
            });

            function resetMatch() {
                serverPoints = 0; receiverPoints = 0;
                serverGames = 0; receiverGames = 0;
                isGameOver = false;
                nextBtn.textContent = 'CONTINUAR';
                lastTimingResult = 'ERROU';
                updateUI();
                resetPoint();
            }

            function startTimingMeter() {
                timingMeterContainer.classList.remove('hidden');
                timingPos = 0;
                timingDirection = 1;

                const barHeight = 400;
                zonesTop = Math.random() * (barHeight - easyHeight);

                zoneEasy.style.top = zonesTop + 'px';
                zoneEasy.style.height = easyHeight + 'px';

                const hardTop = zonesTop + (easyHeight - hardHeight) / 2;
                zoneHard.style.top = hardTop + 'px';
                zoneHard.style.height = hardHeight + 'px';

                const perfectTop = hardTop + (hardHeight - perfectHeight) / 2;
                zonePerfect.style.top = perfectTop + 'px';
                zonePerfect.style.height = perfectHeight + 'px';

                [zoneEasy, zoneHard, zonePerfect].forEach(z => z.classList.remove('active'));

                timingInterval = setInterval(() => {
                    timingPos += 4 * timingDirection;
                    if (timingPos >= barHeight || timingPos <= 0) timingDirection *= -1;
                    timingRacket.style.top = timingPos + 'px';

                    const hardTopVal = parseFloat(zoneHard.style.top);
                    const perfectTopVal = parseFloat(zonePerfect.style.top);
                    let racketY = timingPos;

                    if (gameMode === 'pong') {
                        const isInPerfect = racketY >= perfectTopVal && racketY <= perfectTopVal + perfectHeight;
                        if (isInPerfect) {
                            timingPos += 10 * timingDirection;
                            if (timingPos >= barHeight || timingPos <= 0) timingDirection *= -1;
                            timingRacket.style.top = timingPos + 'px';
                            racketY = timingPos;
                        }
                    }

                    zoneEasy.classList.toggle('active', racketY >= zonesTop && racketY <= zonesTop + easyHeight);
                    zoneHard.classList.toggle('active', racketY >= hardTopVal && racketY <= hardTopVal + hardHeight);
                    zonePerfect.classList.toggle('active', racketY >= perfectTopVal && racketY <= perfectTopVal + perfectHeight);
                }, 20);
            }

            function showFloatingText(text, parent) {
                const floating = document.createElement('div');
                floating.className = 'floating-text';
                floating.textContent = text;
                floating.style.left = '50%';
                floating.style.top = '0';
                parent.appendChild(floating);
                setTimeout(() => floating.remove(), 800);
            }

            function stopTimingMeterCore() {
                clearInterval(timingInterval);

                const racketY = timingPos;
                const hardTopVal = parseFloat(zoneHard.style.top);
                const perfectTopVal = parseFloat(zonePerfect.style.top);

                if (racketY >= perfectTopVal && racketY <= perfectTopVal + perfectHeight) {
                    timingResult = 'PERFEITO';
                } else if (racketY >= hardTopVal && racketY <= hardTopVal + hardHeight) {
                    timingResult = 'DIFÍCIL';
                } else if (racketY >= zonesTop && racketY <= zonesTop + easyHeight) {
                    timingResult = 'FÁCIL';
                } else {
                    timingResult = 'ERROU';
                }

                showFloatingText(timingResult, timingMeterContainer);
                timingMeterContainer.classList.add('hidden');
                return timingResult;
            }

            dirBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    if (gameMode !== 'classic') {
                        return;
                    }
                    if (onlineEnabled && onlineAttackDefenseMode) {
                        const choice = btn.dataset.choice;
                        if (!choice) return;
                        if (onlineResolving) return;

                        dirBtns.forEach(b => b.classList.remove('selected'));
                        btn.classList.add('selected');

                        const iAmAttacker = onlineRole === onlineAttackerRole;
                        if (iAmAttacker) {
                            if (onlinePendingMove !== null) return;
                            onlinePendingMove = choice;
                            onlineLastSentMove = { dir: choice, round: onlineRound, lastSentAt: Date.now(), tries: 0 };
                            const attackerChar = onlineAttackerRole === 'SERVER' ? serverChar : receiverChar;
                            moveCharacter(attackerChar, choice);
                            setTurnStatus('Aguardando defesa...', 'attack');
                            onlineSendEvent('player_move', { dir: choice, round: onlineRound });
                            onlineEnsureResendLoop();
                            classicUpdateOnlineAccess();
                            onlineTryResolveAttackDefense();
                            return;
                        }

                        if (onlinePendingMove === null) return;
                        if (onlinePendingGuess !== null) return;
                        onlinePendingGuess = choice;
                        onlineLastSentGuess = { dir: choice, round: onlineRound, lastSentAt: Date.now(), tries: 0 };
                        const defenderRole = onlineAttackerRole === 'SERVER' ? 'RECEIVER' : 'SERVER';
                        const defenderChar = defenderRole === 'SERVER' ? serverChar : receiverChar;
                        moveCharacter(defenderChar, choice);
                        setTurnStatus('Aguardando resultado...', 'wait');
                        onlineSendEvent('player_guess', { dir: choice, round: onlineRound });
                        onlineEnsureResendLoop();
                        classicUpdateOnlineAccess();
                        onlineTryResolveAttackDefense();
                        return;
                    }
                    if (onlineEnabled && onlineRole !== currentTurn) {
                        return;
                    }
                    const choice = btn.dataset.choice;
                    dirBtns.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');

                    if (currentTurn === 'SERVER') {
                        serverChoice = choice;
                        moveCharacter(serverChar, choice);

                        if (isSinglePlayer) {
                            const options = ['Left', 'Middle', 'Right'];
                            receiverChoice = options[Math.floor(Math.random() * options.length)];
                            moveCharacter(receiverChar, receiverChoice);
                            currentTurn = 'READY';
                            serveBtn.classList.remove('hidden');
                            serveBtn.textContent = 'SACAR!';
                            turnIndicator.textContent = 'CLIQUE EM SACAR PARA PARAR A BARRA!';
                            startTimingMeter();
                            classicUpdateOnlineAccess();
                        } else {
                            if (onlineEnabled) {
                                currentTurn = 'RECEIVER';
                                turnIndicator.textContent = 'VEZ DO RECEBEDOR';
                                dirBtns.forEach(b => b.classList.remove('selected'));
                                onlineBroadcast({ type: 'choice', turn: 'SERVER', choice });
                                classicUpdateOnlineAccess();
                            } else {
                                setTimeout(() => {
                                    currentTurn = 'RECEIVER';
                                    turnIndicator.textContent = 'VEZ DO RECEBEDOR';
                                    dirBtns.forEach(b => b.classList.remove('selected'));
                                }, 500);
                            }
                        }
                    } else if (currentTurn === 'RECEIVER') {
                        receiverChoice = choice;
                        moveCharacter(receiverChar, choice);
                        currentTurn = 'READY';
                        serveBtn.classList.remove('hidden');
                        serveBtn.textContent = 'SACAR!';
                        turnIndicator.textContent = 'SACADOR: CLIQUE EM SACAR PARA PARAR A BARRA!';
                        if (!onlineEnabled || onlineRole === 'SERVER') {
                            startTimingMeter();
                        } else {
                            timingMeterContainer.classList.add('hidden');
                        }
                        if (onlineEnabled) {
                            if (onlineRole !== 'SERVER') {
                                serveBtn.classList.add('hidden');
                            }
                            onlineBroadcast({ type: 'choice', turn: 'RECEIVER', choice });
                        }
                        classicUpdateOnlineAccess();
                    }
                });
            });

            function moveCharacter(char, choice) {
                let target = 50;
                if (choice === 'Left') target = 20;
                if (choice === 'Right') target = 80;

                const start = parseFloat((char.style.left || '50%').replace('%', '')) || 50;
                const startTime = performance.now();
                const duration = 260;

                const tick = (now) => {
                    const t = Math.min(1, (now - startTime) / duration);
                    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    const v = start + (target - start) * ease;
                    char.style.left = `${v}%`;
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            }

            serveBtn.addEventListener('click', () => {
                if (gameMode !== 'classic') return;
                if (serveBtn.classList.contains('hidden')) return;
                if (currentTurn !== 'READY') return;
                if (onlineEnabled && onlineRole !== 'SERVER') return;

                stopTimingMeterCore();
                serveBtn.classList.add('hidden');
                currentTurn = 'PLAYING';
                if (onlineEnabled) {
                    onlineBroadcast({ type: 'serve', timingResult });
                }
                playAnimation();
                classicUpdateOnlineAccess();
            });

            receptionBtn.addEventListener('click', () => {
                if (onlineEnabled && onlineRole !== 'RECEIVER') return;
                if (ballCrossedNet) {
                    perfectTimingReception = true;
                    receptionBtn.classList.add('hidden');
                    createCounterAttackEffect();
                    if (onlineEnabled) {
                        onlineBroadcast({ type: 'reception' });
                    }
                }
            });

            function createCounterAttackEffect() {
                const text = document.createElement('div');
                text.className = 'counter-attack-text';
                text.textContent = 'DEFESA PERFEITA!';
                text.style.left = '50%';
                text.style.top = '50%';
                document.body.appendChild(text);
                setTimeout(() => text.remove(), 1000);
            }

            function playAnimation() {
                const power =
                    timingResult === 'PERFEITO' ? 1 :
                    timingResult === 'DIFÍCIL' ? 0.72 :
                    timingResult === 'FÁCIL' ? 0.38 : 0.05;
                lastTimingResult = timingResult;
                classicShotType = 'FLAT';

                ball.classList.remove('hidden');
                ball.classList.toggle('fire-trail', timingResult === 'PERFEITO');
                ball.style.transition = 'none';
                ball.style.bottom = 'auto';

                const rect = courtEl.getBoundingClientRect();
                const fromLeftPct = parseFloat((serverChar.style.left || '50%').replace('%', '')) || 50;
                const toLeftPct = serverChoice === 'Left' ? 20 : serverChoice === 'Right' ? 80 : 50;
                const fromX = rect.width * (fromLeftPct / 100);
                const toX = rect.width * (toLeftPct / 100);

                const fromBottomPct = 10;
                let toBottomPct = 105;
                if (timingResult === 'FÁCIL') toBottomPct = 40;
                if (timingResult === 'ERROU') toBottomPct = 30;
                const fromY = rect.height * (1 - fromBottomPct / 100);
                const toY = rect.height * (1 - toBottomPct / 100);

                const baseMs = 1200 - power * 780;
                const durMs = classicShotType === 'TOPSPIN' ? baseMs * 0.95 : classicShotType === 'SLICE' ? baseMs * 1.05 : baseMs;
                const durationMs = Math.max(260, Math.min(1400, durMs));
                const curvePx = classicShotType === 'SLICE' ? (rect.width * 0.03 + power * rect.width * 0.03) : 0;
                const arcPx = classicShotType === 'TOPSPIN' ? (rect.height * 0.16 + power * rect.height * 0.1) : (rect.height * 0.12 + power * rect.height * 0.08);

                ball.style.left = `${fromX}px`;
                ball.style.top = `${fromY}px`;
                ball.style.transform = 'translate(-50%, -50%) scale(1.1)';

                ballCrossedNet = false;
                perfectTimingReception = false;

                if (timingResult !== 'ERROU' && timingResult !== 'FÁCIL') {
                    receptionBtn.classList.remove('hidden');
                    setTimeout(() => { ballCrossedNet = true; }, durationMs / 2);
                }

                let isAce = serverChoice !== receiverChoice;
                if (timingResult === 'PERFEITO') isAce = true;
                if (timingResult === 'FÁCIL' || timingResult === 'ERROU') isAce = false;

                const start = performance.now();
                const tick = (now) => {
                    const t = Math.min(1, (now - start) / durationMs);
                    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    const xBase = fromX + (toX - fromX) * ease;
                    const x = xBase + Math.sin(ease * Math.PI * 2) * curvePx * (1 - ease);
                    const yBase = fromY + (toY - fromY) * ease;
                    const y = yBase - Math.sin(Math.PI * ease) * arcPx;
                    const scale = 1.1 - ease * 0.35;
                    ball.style.left = `${x}px`;
                    ball.style.top = `${y}px`;
                    ball.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    if (t < 1) {
                        requestAnimationFrame(tick);
                    } else {
                        receptionBtn.classList.add('hidden');
                        handlePointResult(isAce);
                    }
                };
                requestAnimationFrame(tick);
            }

            function handlePointResult(isAce) {
                if (onlineEnabled && onlineRole !== 'SERVER') {
                    return;
                }
                let winner = '';
                let message = '';

                if (timingResult === 'ERROU') {
                    winner = 'RECEIVER';
                    message = 'ERROU O TIMING! A bola mal saiu do lugar.';
                } else if (timingResult === 'FÁCIL') {
                    winner = 'RECEIVER';
                    message = 'SAQUE CURTO! A bola não chegou na quadra adversária.';
                } else if (perfectTimingReception && serverChoice === receiverChoice) {
                    winner = 'RECEIVER';
                    message = 'DEFESA PERFEITA! Ponto do Recebedor!';
                } else if (isAce) {
                    winner = 'SERVER';
                    if (timingResult === 'PERFEITO') {
                        message = 'PERFEITO! Saque impossível!';
                        triggerScreenShake();
                    } else if (timingResult === 'DIFÍCIL') {
                        message = 'DIFÍCIL! Saque potente!';
                    } else {
                        message = 'FÁCIL! Mas o sacador venceu.';
                    }
                } else {
                    winner = 'RECEIVER';
                    message = 'Defesa espetacular! Ponto do Recebedor!';
                }

                createSandParticles(winner);
                updateScoring(winner);

                if (onlineEnabled) {
                    const shake = winner === 'SERVER' && timingResult === 'PERFEITO';
                    onlineBroadcast({
                        type: 'result',
                        winner,
                        shake,
                        state: {
                            serverPoints,
                            receiverPoints,
                            serverGames,
                            receiverGames,
                            currentTurn,
                            isGameOver,
                            lastTimingResult,
                            nextBtnText: nextBtn.textContent
                        },
                        modal: {
                            title: winner === 'SERVER' ? 'PONTO DO SACADOR!' : 'PONTO DO RECEBEDOR!',
                            message,
                            starsCount: getStarsForTimingResult(timingResult)
                        }
                    });
                }

                showResultModal(
                    winner === 'SERVER' ? 'PONTO DO SACADOR!' : 'PONTO DO RECEBEDOR!',
                    message,
                    getStarsForTimingResult(timingResult)
                );
            }

            function updateScoring(winner) {
                if (winner === 'SERVER') {
                    serverPoints++;
                } else {
                    receiverPoints++;
                }

                if (serverPoints >= 4 && serverPoints > receiverPoints) {
                    winGame('SERVER');
                } else if (receiverPoints >= 4 && receiverPoints > serverPoints) {
                    winGame('RECEIVER');
                } else if (serverPoints === 3 && receiverPoints === 3) {
                    turnIndicator.textContent = 'PONTO DE OURO!';
                }

                updateUI();
            }

            function winGame(winner) {
                if (winner === 'SERVER') {
                    serverGames++;
                } else {
                    receiverGames++;
                }
                serverPoints = 0;
                receiverPoints = 0;

                if (serverGames >= 6 || receiverGames >= 6) {
                    isGameOver = true;
                    const overallWinner = serverGames >= 6 ? 'SACADOR' : 'RECEBEDOR';
                    resultTitle.textContent = 'FIM DE JOGO!';
                    resultText.innerHTML = `<strong>${overallWinner} VENCEU A PARTIDA!</strong>`;
                    nextBtn.textContent = 'VOLTAR AO MENU';
                }
            }

            function updateUI() {
                if (gameMode === 'pong') {
                    serverScoreEl.textContent = String(pongPlayerPoints);
                    receiverScoreEl.textContent = String(pongAiPoints);
                    serverGamesEl.textContent = '0';
                    receiverGamesEl.textContent = '0';
                    return;
                }
                if (gameMode === 'fps3d') {
                    serverScoreEl.textContent = String(fps3dPlayerPoints);
                    receiverScoreEl.textContent = String(fps3dAiPoints);
                    serverGamesEl.textContent = '0';
                    receiverGamesEl.textContent = '0';
                    return;
                }
                if (gameMode === 'classic' && onlineEnabled && onlineAttackDefenseMode) {
                    const now = Date.now();
                    const flashActive = onlineScoreFlash && onlineScoreFlash.until && now <= onlineScoreFlash.until;
                    if (flashActive && onlineScoreFlash.scorerRole === 'SERVER') {
                        serverScoreEl.textContent = 'GAME';
                        receiverScoreEl.textContent = '0';
                    } else if (flashActive && onlineScoreFlash.scorerRole === 'RECEIVER') {
                        serverScoreEl.textContent = '0';
                        receiverScoreEl.textContent = 'GAME';
                    } else {
                        serverScoreEl.textContent = scoreMap[serverPoints] || '40';
                        receiverScoreEl.textContent = scoreMap[receiverPoints] || '40';
                    }
                    serverGamesEl.textContent = String(serverGames);
                    receiverGamesEl.textContent = String(receiverGames);
                    return;
                }
                serverScoreEl.textContent = scoreMap[serverPoints] || '40';
                receiverScoreEl.textContent = scoreMap[receiverPoints] || '40';
                serverGamesEl.textContent = serverGames;
                receiverGamesEl.textContent = receiverGames;
            }

            function triggerScreenShake() {
                gameScreen.classList.add('shake');
                setTimeout(() => gameScreen.classList.remove('shake'), 500);
            }

            function createSandParticles(winner) {
                const court = document.querySelector('.court');
                for (let i = 0; i < 15; i++) {
                    const p = document.createElement('div');
                    p.className = 'particle';
                    p.style.left = (40 + Math.random() * 20) + '%';
                    p.style.top = winner === 'SERVER' ? '10%' : '85%';
                    court.appendChild(p);

                    const angle = Math.random() * Math.PI * 2;
                    const velocity = 2 + Math.random() * 5;
                    const vx = Math.cos(angle) * velocity;
                    const vy = Math.sin(angle) * velocity;

                    let pos = { x: 0, y: 0 };
                    const anim = setInterval(() => {
                        pos.x += vx;
                        pos.y += vy;
                        p.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                        if (Math.abs(pos.x) > 50) {
                            clearInterval(anim);
                            p.remove();
                        }
                    }, 20);
                }
            }

            nextBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                if (gameMode === 'classic' && onlineEnabled && onlineAttackDefenseMode) {
                    onlineResolving = false;
                    dirBtns.forEach(b => b.classList.remove('selected'));
                    onlineScoreFlash = null;
                    serverChar.style.left = '50%';
                    receiverChar.style.left = '50%';
                    classicUpdateOnlineAccess();
                    return;
                }
                if (isGameOver) {
                    pongStopLoop();
                    fps3dStop();
                    timingMeterContainer.classList.add('hidden');
                    fps3dLayer.classList.add('hidden');
                    fps3dBallEl.classList.add('hidden');
                    fps3dRacketEl.classList.add('hidden');
                    pongStaminaEl.classList.add('hidden');
                    pongStarEl.classList.add('hidden');
                    pongShadowEl.classList.add('hidden');
                    ball.classList.remove('fire-trail');
                    gameScreen.classList.remove('pong-mode');
                    gameScreen.classList.remove('fps3d-mode');
                    landingScreen.classList.remove('hidden');
                    menuScreen.classList.add('hidden');
                    gameScreen.classList.add('hidden');
                } else {
                    if (gameMode === 'pong') {
                        pongStartRally();
                    } else if (gameMode === 'fps3d') {
                        fps3dStartRally();
                    } else {
                        if (onlineEnabled) {
                            if (onlineRole !== 'SERVER') return;
                            onlineBroadcast({ type: 'next' });
                        }
                        resetPoint();
                        classicUpdateOnlineAccess();
                    }
                }
            });

            function resetPoint() {
                currentTurn = 'SERVER';
                serverChoice = null;
                receiverChoice = null;
                ballCrossedNet = false;
                perfectTimingReception = false;
                timingResult = 'ERROU';
                lastTimingResult = 'ERROU';
                classicCharging = false;
                classicChargeStart = 0;
                classicPowerNorm = 0;
                classicShotType = 'FLAT';
                serverChar.classList.remove('charging');
                clearInterval(timingInterval);
                timingMeterContainer.classList.add('hidden');

                turnIndicator.textContent = 'VEZ DO SACADOR';
                dirBtns.forEach(b => b.classList.remove('selected'));
                serveBtn.classList.add('hidden');
                receptionBtn.classList.add('hidden');
                ball.classList.add('hidden');
                ball.classList.remove('fire-trail');
                ball.style.transition = 'none';
                ball.style.top = 'auto';
                ball.style.bottom = '10%';
            }

            function pongSetUi() {
                isSinglePlayer = true;
                gameMode = 'pong';
                menuScreen.classList.add('hidden');
                landingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                gameScreen.classList.add('pong-mode');
                gameScreen.classList.remove('fps3d-mode');
                fps3dStop();
                fps3dLayer.classList.add('hidden');
                fps3dBallEl.classList.add('hidden');
                fps3dRacketEl.classList.add('hidden');
                pongStaminaEl.classList.remove('hidden');
                playerNameEls[0].textContent = 'JOGADOR';
                playerNameEls[1].textContent = 'COMPUTADOR';
                dirBtns.forEach((b, i) => { b.textContent = dirBtnClassicLabels[i]; });
                easyHeight = 310;
                hardHeight = 200;
                perfectHeight = 60;
                pongKeyUp = false;
                pongKeyDown = false;
                pongStamina = 100;
                pongFatigueUntil = 0;
                pongAiNerfUntil = 0;
                pongStarActive = false;
                pongStarEl.classList.add('hidden');
                pongShadowEl.classList.add('hidden');
                ball.classList.remove('fire-trail');
                receptionBtn.classList.add('hidden');
                serveBtn.classList.add('hidden');
                pongPlayerPoints = 0;
                pongAiPoints = 0;
                isGameOver = false;
                nextBtn.textContent = 'CONTINUAR';
                updateUI();
            }

            function pongClamp(value, min, max) {
                return Math.max(min, Math.min(max, value));
            }

            function pongGetCourtMetrics() {
                const rect = courtEl.getBoundingClientRect();
                const paddleH = pongPlayerPaddle.getBoundingClientRect().height || 96;
                const paddleW = pongPlayerPaddle.getBoundingClientRect().width || 16;
                const ballR = (ball.getBoundingClientRect().width || 16) / 2;
                return { rect, paddleH, paddleW, ballR };
            }

            function pongSetPaddleY(paddleEl, y) {
                paddleEl.style.top = `${y}px`;
            }

            function pongSetBallPos(x, y) {
                ball.classList.remove('hidden');
                ball.style.transition = 'none';
                ball.style.bottom = 'auto';
                ball.style.top = `${y}px`;
                ball.style.left = `${x}px`;
                ball.style.transform = 'translate(-50%, -50%) scale(1)';
            }

            function pongStopLoop() {
                if (pongLoopId) cancelAnimationFrame(pongLoopId);
                pongLoopId = null;
                pongLastFrame = 0;
            }

            function pongStartLoop() {
                pongStopLoop();
                pongLoopId = requestAnimationFrame(pongTick);
            }

            function pongTick(ts) {
                if (!pongLastFrame) pongLastFrame = ts;
                if (ts < pongHitStopUntil) {
                    pongLoopId = requestAnimationFrame(pongTick);
                    return;
                }
                const dt = Math.min(24, ts - pongLastFrame);
                pongLastFrame = ts;

                const { rect, paddleH, paddleW, ballR } = pongGetCourtMetrics();
                const maxY = rect.height - paddleH;
                const fatigued = ts < pongFatigueUntil;
                const playerMaxSpeed = fatigued ? 0 : 0.7;
                const dir = fatigued ? 0 : (pongKeyDown ? 1 : 0) - (pongKeyUp ? 1 : 0);
                pongPlayerY = pongClamp(pongPlayerY + dir * playerMaxSpeed * dt, 0, maxY);
                pongSetPaddleY(pongPlayerPaddle, pongPlayerY);

                pongStamina = pongClamp(pongStamina + dt * 0.012, 0, 100);
                pongStaminaFillEl.style.width = `${pongStamina}%`;
                pongStaminaEl.classList.toggle('hidden', gameMode !== 'pong');

                const aiMaxSpeed = ts < pongAiNerfUntil ? 0.22 : 0.42;
                const aiError = pongBallVX > 0 ? Math.sin(ts / 220) * 18 : 0;
                const aiTarget = (pongBallY + aiError) - paddleH / 2;
                const aiDy = pongClamp(aiTarget - pongAiY, -aiMaxSpeed * dt, aiMaxSpeed * dt);
                pongAiY = pongClamp(pongAiY + aiDy, 0, maxY);
                pongSetPaddleY(pongAiPaddle, pongAiY);

                pongCurvePhase += dt;
                if (pongCurveAmp) {
                    pongBallVY += Math.sin(pongCurvePhase / 110) * pongCurveAmp * (dt / 1000);
                }

                pongBallZV -= 0.55 * (dt / 16);
                pongBallZ += pongBallZV * (dt / 16);
                if (pongBallZ < 0) {
                    pongBallZ = 0;
                    pongBallZV = -pongBallZV * 0.56;
                    if (pongBallZV < 0.25) pongBallZV = 0;
                }

                pongBallX += pongBallVX * (dt / 16);
                pongBallY += pongBallVY * (dt / 16);

                if (pongBallY <= ballR) {
                    pongBallY = ballR;
                    pongBallVY = Math.abs(pongBallVY);
                }
                if (pongBallY >= rect.height - ballR) {
                    pongBallY = rect.height - ballR;
                    pongBallVY = -Math.abs(pongBallVY);
                }

                const playerX = 18 + paddleW;
                const aiX = rect.width - 18 - paddleW;

                const playerCenterY = pongPlayerY + paddleH / 2;
                const aiCenterY = pongAiY + paddleH / 2;

                if (pongBallVX < 0 && pongBallX - ballR <= playerX) {
                    const distY = Math.abs(pongBallY - playerCenterY);
                    const withinNormal = distY <= paddleH / 2 + ballR;
                    const withinLunge = distY <= paddleH * 0.75 + ballR;
                    const canLunge = !withinNormal && withinLunge && pongStamina >= 50 && !fatigued;
                    if ((withinNormal || canLunge) && !pongAwaitingHit) {
                        if (canLunge) {
                            pongStamina = pongClamp(pongStamina - 50, 0, 100);
                            pongFatigueUntil = ts + 1000;
                        }
                        pongAwaitingHit = true;
                        pongHitPhase = 'timing';
                        pongStopLoop();
                        pongBallX = playerX + ballR;
                        pongSetBallPos(pongBallX, pongBallY);
                        startTimingMeter();
                        clearTimeout(pongAutoHitTimeout);
                        pongAutoHitTimeout = setTimeout(() => {
                            if (gameMode !== 'pong') return;
                            if (!pongAwaitingHit) return;
                            if (pongHitPhase !== 'timing') return;
                            clearInterval(timingInterval);
                            timingMeterContainer.classList.add('hidden');
                            pongApplyPlayerHit('ERROU');
                        }, 1600);
                        turnIndicator.textContent = canLunge ? 'LUNGE! CLIQUE PARA REBATER!' : 'CLIQUE PARA REBATER!';
                        return;
                    }
                    if (!withinNormal && !withinLunge) {
                        pongEndPoint('AI');
                        return;
                    }
                }

                if (pongBallVX > 0 && pongBallX + ballR >= aiX) {
                    const within = Math.abs(pongBallY - aiCenterY) <= paddleH / 2 + ballR;
                    if (within) {
                        pongHitStopUntil = ts + 50;
                        const offset = (pongBallY - aiCenterY) / (paddleH / 2);
                        pongBallX = aiX - ballR;
                        pongBallVX = -Math.abs(pongBallVX);
                        pongBallVY = pongBallVY + offset * 3.2;
                        pongBallZ = Math.min(26, pongBallZ + 10);
                        pongBallZV = Math.abs(pongBallZV) + 3.8;
                        if (ball.classList.contains('fire-trail')) {
                            pongAiY = pongClamp(pongAiY + offset * 22, 0, maxY);
                            pongAiNerfUntil = Math.max(pongAiNerfUntil, ts + 520);
                        }
                    } else {
                        pongEndPoint('PLAYER');
                        return;
                    }
                }

                pongSetBallPos(pongBallX, pongBallY);
                pongShadowEl.classList.toggle('hidden', gameMode !== 'pong');
                pongShadowEl.style.left = `${pongBallX}px`;
                pongShadowEl.style.top = `${pongBallY + ballR + pongBallZ * 0.55}px`;
                const shadowScale = Math.max(0.55, 1 - pongBallZ / 58);
                pongShadowEl.style.transform = `translate(-50%, -50%) scale(${shadowScale})`;
                pongShadowEl.style.filter = `blur(${2.4 + pongBallZ / 14}px)`;
                pongLoopId = requestAnimationFrame(pongTick);
            }

            function pongApplyPlayerHit(result) {
                clearTimeout(pongAutoHitTimeout);
                pongAutoHitTimeout = null;
                pongAwaitingHit = false;
                pongHitPhase = 'none';

                const now = performance.now();
                const { rect, paddleH, ballR } = pongGetCourtMetrics();
                const playerCenterY = pongPlayerY + paddleH / 2;

                timingResult = result;
                lastTimingResult = result;

                const powerNorm =
                    result === 'PERFEITO' ? 1 :
                    result === 'DIFÍCIL' ? 0.7 :
                    result === 'FÁCIL' ? 0.38 : 0.05;
                const shotType =
                    result === 'PERFEITO' ? 'FLAT' :
                    result === 'DIFÍCIL' ? 'TOPSPIN' :
                    result === 'FÁCIL' ? 'SLICE' : 'FLAT';
                const perfectCharge = result === 'PERFEITO';

                const starCollected = pongStarActive && Math.abs(playerCenterY - pongStarY) <= 18;
                if (starCollected) {
                    pongStarActive = false;
                    pongStarEl.classList.add('hidden');
                    timingResult = 'PERFEITO';
                    lastTimingResult = 'PERFEITO';
                    pongAiNerfUntil = now + 900;
                    triggerScreenShake();
                } else if (perfectCharge) {
                    pongAiNerfUntil = now + 700;
                }

                ball.classList.toggle('fire-trail', starCollected || perfectCharge);

                const base = 7.0 + powerNorm * 9.2;
                const typeMult = shotType === 'TOPSPIN' ? 0.92 : shotType === 'SLICE' ? 0.88 : 1;
                const maxed = starCollected ? 18.0 : base * typeMult * (perfectCharge ? 1.18 : 1);
                pongBallVX = Math.abs(maxed);

                const offset = (pongBallY - playerCenterY) / (paddleH / 2);
                pongBallVY = offset * (shotType === 'TOPSPIN' ? 5.0 : 4.2);

                pongCurvePhase = 0;
                pongCurveAmp = shotType === 'SLICE' ? (1.2 + powerNorm * 2.4) : 0;

                pongBallZ = shotType === 'TOPSPIN' ? (18 + powerNorm * 20) : (6 + powerNorm * 10);
                pongBallZV = shotType === 'TOPSPIN' ? (8.5 + powerNorm * 5.5) : (5 + powerNorm * 4.2);

                pongBallX = (18 + 16) + ballR;
                pongSetBallPos(pongBallX, pongBallY);
                pongHitStopUntil = now + (starCollected ? 90 : 50);
                turnIndicator.textContent = shotType === 'TOPSPIN' ? 'TOPSPIN!' : shotType === 'SLICE' ? 'SLICE!' : 'FLAT!';

                if (!pongStarActive && shotType !== 'FLAT' && powerNorm > 0.38 && Math.random() < 0.28) {
                    pongStarActive = true;
                    pongStarY = rect.height * (0.2 + Math.random() * 0.6);
                    pongStarEl.classList.remove('hidden');
                    pongStarEl.style.left = `${rect.width * 0.72}px`;
                    pongStarEl.style.top = `${pongStarY}px`;
                }

                pongStartLoop();
            }

            function pongEndPoint(winner) {
                pongStopLoop();
                ball.classList.add('hidden');
                ball.classList.remove('fire-trail');
                serveBtn.classList.add('hidden');
                timingMeterContainer.classList.add('hidden');
                pongAwaitingHit = false;
                pongCharging = false;
                pongPlayerPaddle.classList.remove('charging');
                pongHitPhase = 'none';
                clearTimeout(pongAutoHitTimeout);
                pongAutoHitTimeout = null;
                pongStarActive = false;
                pongStarEl.classList.add('hidden');
                pongShadowEl.classList.add('hidden');

                if (winner === 'PLAYER') {
                    pongPlayerPoints += 1;
                } else {
                    pongAiPoints += 1;
                }
                updateUI();
                if (winner === 'PLAYER') triggerScreenShake();

                const maxPoints = 7;
                if (pongPlayerPoints >= maxPoints || pongAiPoints >= maxPoints) {
                    isGameOver = true;
                    const overallWinner = pongPlayerPoints > pongAiPoints ? 'JOGADOR' : 'COMPUTADOR';
                    nextBtn.textContent = 'VOLTAR AO INÍCIO';
                    showResultModal('FIM DE JOGO!', `<strong>${overallWinner} VENCEU!</strong>`, getStarsForTimingResult(lastTimingResult));
                    return;
                }

                showResultModal(
                    winner === 'PLAYER' ? 'PONTO DO JOGADOR!' : 'PONTO DO COMPUTADOR!',
                    winner === 'PLAYER' ? 'Boa! Você marcou.' : 'O computador marcou.',
                    getStarsForTimingResult(lastTimingResult)
                );
            }

            function pongStartRally() {
                pongStopLoop();
                clearTimeout(pongAutoHitTimeout);
                pongAutoHitTimeout = null;
                pongAwaitingHit = false;
                pongHitPhase = 'none';
                pongPlayerPaddle.classList.remove('charging');
                pongHitStopUntil = 0;
                pongCurveAmp = 0;
                pongCurvePhase = 0;
                pongBallZ = 0;
                pongBallZV = 0;
                ball.classList.remove('fire-trail');
                pongStarActive = false;
                pongStarEl.classList.add('hidden');
                pongShadowEl.classList.remove('hidden');

                const { rect, paddleH, ballR } = pongGetCourtMetrics();
                pongAiY = pongClamp(rect.height / 2 - paddleH / 2, 0, rect.height - paddleH);
                pongSetPaddleY(pongAiPaddle, pongAiY);
                pongPlayerY = pongClamp(rect.height / 2 - paddleH / 2, 0, rect.height - paddleH);
                pongSetPaddleY(pongPlayerPaddle, pongPlayerY);

                pongBallX = rect.width / 2;
                pongBallY = rect.height / 2;
                pongBallVX = -6.6;
                pongBallVY = 2.6;
                pongSetBallPos(pongBallX, pongBallY);
                turnIndicator.textContent = 'MOVA COM W/S. CLIQUE PARA REBATER!';
                pongStartLoop();
            }

            function fps3dStop() {
                if (fps3dLoopId) cancelAnimationFrame(fps3dLoopId);
                fps3dLoopId = null;
                fps3dLastTs = 0;
                fps3dStartTs = 0;
                fps3dState = 'idle';
                fps3dLayer.classList.remove('hit');
                fps3dLayer.classList.remove('perfect');
                fps3dLayer.classList.remove('perfect-cue');
                fps3dBallEl.classList.remove('perfect-now');
                fps3dNowEl.classList.add('hidden');
                fps3dPerfectPrev = false;
            }

            function fps3dSetUi() {
                isSinglePlayer = true;
                gameMode = 'fps3d';
                menuScreen.classList.add('hidden');
                landingScreen.classList.add('hidden');
                gameScreen.classList.remove('hidden');
                gameScreen.classList.remove('pong-mode');
                gameScreen.classList.add('fps3d-mode');
                pongStopLoop();
                clearTimeout(pongAutoHitTimeout);
                pongAutoHitTimeout = null;
                pongStaminaEl.classList.add('hidden');
                pongStarEl.classList.add('hidden');
                pongShadowEl.classList.add('hidden');
                ball.classList.remove('fire-trail');
                timingMeterContainer.classList.add('hidden');
                receptionBtn.classList.add('hidden');
                serveBtn.classList.add('hidden');
                ball.classList.add('hidden');
                fps3dLayer.classList.remove('hidden');
                fps3dBallEl.classList.remove('hidden');
                fps3dRacketEl.classList.remove('hidden');
                fps3dNowEl.classList.add('hidden');
                fps3dOpponentEl.classList.remove('hidden');
                playerNameEls[0].textContent = 'JOGADOR';
                playerNameEls[1].textContent = 'COMPUTADOR';
                fps3dPlayerPoints = 0;
                fps3dAiPoints = 0;
                lastTimingResult = 'ERROU';
                isGameOver = false;
                nextBtn.textContent = 'CONTINUAR';
                const rect = courtEl.getBoundingClientRect();
                fps3dRacket = { x: rect.width * 0.5, y: rect.height * 0.87 };
                fps3dRacketEl.style.left = `${fps3dRacket.x}px`;
                fps3dRacketEl.style.top = `${fps3dRacket.y}px`;
                updateUI();
            }

            function fps3dSpawnTrajectory() {
                const rect = courtEl.getBoundingClientRect();
                const lane = (Math.random() * 2 - 1) * rect.width * 0.22;
                const toX = rect.width * 0.5 + lane;
                const toY = rect.height * (0.70 + Math.random() * 0.12);
                fps3dFrom = { x: rect.width * 0.5 + lane * 0.18, y: rect.height * (0.22 + Math.random() * 0.08) };
                fps3dTo = { x: toX, y: toY };
                fps3dBounceCount = 2 + Math.floor(Math.random() * 3);
                fps3dBounceAmpMul = 0.055 + Math.random() * 0.045;
                fps3dCurveAmp = rect.width * (0.015 + Math.random() * 0.025) * (Math.random() < 0.5 ? -1 : 1);
                fps3dCurveFreq = 2 + Math.floor(Math.random() * 2);
                fps3dCurvePhase = Math.random() * Math.PI * 2;
            }

            function fps3dRender(t) {
                const rect = courtEl.getBoundingClientRect();
                const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                const bounce = Math.abs(Math.sin(ease * Math.PI * fps3dBounceCount));
                const bounceAmp = rect.height * fps3dBounceAmpMul * (1 - ease * 0.55);
                const scale = 0.18 + 0.98 * Math.pow(ease, 1.15);
                const blur = (1 - ease) * 1.1;
                const xBase = fps3dFrom.x + (fps3dTo.x - fps3dFrom.x) * ease;
                const x2 = xBase + Math.sin(ease * Math.PI * fps3dCurveFreq + fps3dCurvePhase) * fps3dCurveAmp * (1 - ease);
                const y2 = (fps3dFrom.y + (fps3dTo.y - fps3dFrom.y) * ease) - bounce * bounceAmp;
                fps3dBallEl.style.left = `${x2}px`;
                fps3dBallEl.style.top = `${y2}px`;
                fps3dBallEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
                fps3dBallEl.style.filter = `blur(${blur}px)`;
            }

            function fps3dTick(ts) {
                if (gameMode !== 'fps3d') return;
                if (fps3dState !== 'approaching') return;
                if (!fps3dStartTs) fps3dStartTs = ts;
                fps3dLastTs = ts;

                const elapsed = ts - fps3dStartTs;
                fps3dT = Math.min(1, elapsed / fps3dApproachMs);
                fps3dRender(fps3dT);
                const perfectNow = fps3dT >= fps3dPerfectStart && fps3dT <= fps3dPerfectEnd;
                fps3dBallEl.classList.toggle('perfect-now', perfectNow);
                fps3dLayer.classList.toggle('perfect-cue', perfectNow);
                fps3dNowEl.classList.toggle('hidden', !perfectNow);
                if (perfectNow) {
                    const bx = parseFloat(fps3dBallEl.style.left) || 0;
                    const by = parseFloat(fps3dBallEl.style.top) || 0;
                    fps3dNowEl.style.left = `${bx}px`;
                    fps3dNowEl.style.top = `${Math.max(0, by - 90)}px`;
                }
                if (perfectNow && !fps3dPerfectPrev) {
                    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
                }
                fps3dPerfectPrev = perfectNow;

                if (fps3dT >= 1) {
                    timingResult = 'ERROU';
                    lastTimingResult = 'ERROU';
                    fps3dEndPoint('AI', 'ERROU O TEMPO! Você não conseguiu rebater.');
                    return;
                }

                fps3dLoopId = requestAnimationFrame(fps3dTick);
            }

            function fps3dAnimateBall(from, to, durationMs, scaleFrom, scaleTo, onDone) {
                if (fps3dLoopId) cancelAnimationFrame(fps3dLoopId);
                fps3dLoopId = null;
                fps3dState = 'anim';
                const start = performance.now();
                const tick = (now) => {
                    if (gameMode !== 'fps3d') return;
                    const t = Math.min(1, (now - start) / durationMs);
                    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                    const x = from.x + (to.x - from.x) * ease;
                    const y = from.y + (to.y - from.y) * ease - Math.sin(Math.PI * ease) * (courtEl.getBoundingClientRect().height * 0.06);
                    const scale = scaleFrom + (scaleTo - scaleFrom) * ease;
                    fps3dBallEl.style.left = `${x}px`;
                    fps3dBallEl.style.top = `${y}px`;
                    fps3dBallEl.style.transform = `translate(-50%, -50%) scale(${scale})`;
                    fps3dBallEl.style.filter = `blur(${(1 - scale) * 0.9}px)`;
                    if (t >= 1) {
                        fps3dState = 'resolve';
                        onDone();
                        return;
                    }
                    fps3dLoopId = requestAnimationFrame(tick);
                };
                fps3dLoopId = requestAnimationFrame(tick);
            }

            function fps3dStartApproachFrom(from) {
                const rect = courtEl.getBoundingClientRect();
                fps3dApproachMs = 1750 + Math.random() * 520;
                const lane = (Math.random() * 2 - 1) * rect.width * 0.22;
                fps3dFrom = { x: from.x, y: from.y };
                fps3dTo = { x: rect.width * 0.5 + lane, y: rect.height * (0.70 + Math.random() * 0.12) };
                fps3dBounceCount = 2 + Math.floor(Math.random() * 3);
                fps3dBounceAmpMul = 0.055 + Math.random() * 0.045;
                fps3dCurveAmp = rect.width * (0.015 + Math.random() * 0.025) * (Math.random() < 0.5 ? -1 : 1);
                fps3dCurveFreq = 2 + Math.floor(Math.random() * 2);
                fps3dCurvePhase = Math.random() * Math.PI * 2;
                fps3dStartTs = performance.now();
                fps3dT = 0;
                fps3dPerfectPrev = false;
                fps3dState = 'approaching';
                fps3dLoopId = requestAnimationFrame(fps3dTick);
            }

            function fps3dStartRally() {
                fps3dStop();
                fps3dApproachMs = 1750 + Math.random() * 520;
                fps3dSpawnTrajectory();
                fps3dStartTs = 0;
                fps3dT = 0;
                fps3dState = 'serve';
                fps3dLayer.classList.remove('perfect');
                fps3dLayer.classList.remove('perfect-cue');
                fps3dBallEl.classList.remove('perfect-now');
                fps3dNowEl.classList.add('hidden');
                fps3dBallEl.classList.remove('hidden');
                turnIndicator.textContent = 'SAQUE DO COMPUTADOR... (mova o mouse)';
                setTimeout(() => {
                    if (gameMode !== 'fps3d') return;
                    if (isGameOver) return;
                    fps3dOpponentSwing();
                    fps3dPerfectPrev = false;
                    fps3dState = 'approaching';
                    turnIndicator.textContent = 'MOVA A RAQUETE (MOUSE) E CLIQUE NO TEMPO CERTO!';
                    fps3dLoopId = requestAnimationFrame(fps3dTick);
                }, 320);
            }

            function fps3dHandleClickHit() {
                const t = fps3dT;
                let result = 'ERROU';
                if (t >= fps3dPerfectStart && t <= fps3dPerfectEnd) {
                    result = 'PERFEITO';
                } else if (t >= fps3dHardStart && t <= fps3dHardEnd) {
                    result = 'DIFÍCIL';
                } else if (t >= fps3dEasyStart && t <= fps3dEasyEnd) {
                    result = 'FÁCIL';
                }

                timingResult = result;
                lastTimingResult = result;

                if (fps3dLoopId) cancelAnimationFrame(fps3dLoopId);
                fps3dLoopId = null;
                fps3dState = 'resolve';

                fps3dLayer.classList.add('hit');
                setTimeout(() => fps3dLayer.classList.remove('hit'), 200);
                fps3dRacketEl.classList.add('swing');
                setTimeout(() => fps3dRacketEl.classList.remove('swing'), 280);

                if (result === 'PERFEITO') {
                    fps3dLayer.classList.add('perfect');
                } else {
                    fps3dLayer.classList.remove('perfect');
                }

                const ballRect = fps3dBallEl.getBoundingClientRect();
                const courtRect = courtEl.getBoundingClientRect();
                const ballX = ballRect.left + ballRect.width / 2 - courtRect.left;
                const ballY = ballRect.top + ballRect.height / 2 - courtRect.top;
                const dx = ballX - fps3dRacket.x;
                const dy = ballY - fps3dRacket.y;
                const dist = Math.hypot(dx, dy);
                const racketMiss = dist > 260;
                if (racketMiss) result = 'ERROU';

                if (result === 'ERROU') {
                    timingResult = 'ERROU';
                    lastTimingResult = 'ERROU';
                    fps3dEndPoint('AI', racketMiss ? 'RAQUETE LONGE! Você não alcançou a bola.' : 'ERROU O TIMING! O computador marcou.');
                    return;
                }

                const stars = getStarsForTimingResult(result);
                const aiReturnChance = stars === 3 ? 0.10 : stars === 2 ? 0.22 : 0.45;
                const aiReturned = Math.random() < aiReturnChance;
                if (aiReturned) {
                    fps3dApproachMs = Math.max(820, fps3dApproachMs - (stars === 3 ? 220 : 160));
                    const rect = courtEl.getBoundingClientRect();
                    const from = { x: ballX, y: ballY };
                    const to = { x: rect.width * (0.5 + (Math.random() * 2 - 1) * 0.12), y: rect.height * 0.26 };
                    fps3dAnimateBall(from, to, 230, 1.02, 0.22, () => {
                        if (gameMode !== 'fps3d') return;
                        if (isGameOver) return;
                        fps3dOpponentSwing();
                        fps3dSpawnTrajectory();
                        fps3dStartTs = 0;
                        fps3dT = 0;
                        fps3dPerfectPrev = false;
                        fps3dState = 'approaching';
                        turnIndicator.textContent = 'O COMPUTADOR REBATEU! MOVA O MOUSE E CLIQUE NO TEMPO CERTO!';
                        fps3dLoopId = requestAnimationFrame(fps3dTick);
                    });
                    return;
                }

                fps3dEndPoint('PLAYER', result === 'PERFEITO' ? 'PERFEITO! Ponto do jogador!' : 'Boa! Você marcou.');
            }

            function fps3dEndPoint(winner, message) {
                fps3dStop();
                const rect = courtEl.getBoundingClientRect();
                const fromX = parseFloat(fps3dBallEl.style.left) || rect.width * 0.5;
                const fromY = parseFloat(fps3dBallEl.style.top) || rect.height * 0.72;
                const from = { x: fromX, y: fromY };

                if (winner === 'PLAYER') {
                    fps3dPlayerPoints += 1;
                } else {
                    fps3dAiPoints += 1;
                }
                updateUI();

                const maxPoints = 7;
                if (fps3dPlayerPoints >= maxPoints || fps3dAiPoints >= maxPoints) {
                    isGameOver = true;
                    const overallWinner = fps3dPlayerPoints > fps3dAiPoints ? 'JOGADOR' : 'COMPUTADOR';
                    nextBtn.textContent = 'VOLTAR AO INÍCIO';
                    fps3dBallEl.classList.add('hidden');
                    showResultModal('FIM DE JOGO!', `<strong>${overallWinner} VENCEU!</strong>`, getStarsForTimingResult(lastTimingResult));
                    return;
                }

                fps3dBallEl.classList.remove('hidden');
                fps3dNowEl.classList.add('hidden');
                fps3dBallEl.classList.remove('perfect-now');
                fps3dLayer.classList.remove('perfect-cue');

                turnIndicator.textContent = (winner === 'PLAYER' ? 'PONTO! ' : 'PONTO DO COMPUTADOR! ') + 'O COMPUTADOR VAI REBATER...';

                const toComp = { x: rect.width * 0.5, y: rect.height * 0.28 };
                fps3dAnimateBall(from, toComp, 240, 1.02, 0.22, () => {
                    if (gameMode !== 'fps3d') return;
                    if (isGameOver) return;
                    fps3dOpponentSwing();
                    turnIndicator.textContent = 'O COMPUTADOR REBATEU! MOVA O MOUSE E CLIQUE NO TEMPO CERTO!';
                    fps3dStartApproachFrom({ x: toComp.x, y: toComp.y });
                });
            }

            landingMode2Btn.addEventListener('click', () => {
                pongSetUi();
                pongStartRally();
            });
        });
    
