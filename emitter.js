'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {

    const subscriptions = new Map();

    function emitForEvent(event) {
        const currentEventSubscriptions = subscriptions.get(event);
        if (currentEventSubscriptions !== undefined) {
            for (let subscription of currentEventSubscriptions) {
                subscription.handler.call(subscription.context);
            }
        }
    }

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object} this
         */
        on: function (event, context, handler) {

            let currentEventSubscriptions = subscriptions.get(event);
            if (currentEventSubscriptions === undefined) {
                currentEventSubscriptions = [];
                subscriptions.set(event, currentEventSubscriptions);
            }

            currentEventSubscriptions.push({
                context,
                handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object} this
         */
        off: function (event, context) {

            const eventsToUnsubscribeFrom = [];
            for (let currentEvent of subscriptions.keys()) {
                if (currentEvent.indexOf(event) === 0 && (currentEvent.length <= event.length ||
                    currentEvent[event.length] === '.')) {
                    eventsToUnsubscribeFrom.push(currentEvent);
                }
            }

            for (let currentEvent of eventsToUnsubscribeFrom) {
                const currentEventSubscriptions = subscriptions.get(currentEvent);
                subscriptions.delete(currentEvent);
                subscriptions.set(currentEvent, currentEventSubscriptions.filter((subscription) => {
                    return subscription.context !== context;
                }));
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object} this
         */
        emit: function (event) {

            let currentEvent = event;
            emitForEvent(currentEvent);
            while (currentEvent.indexOf('.') !== -1) {
                currentEvent = currentEvent.substring(0, currentEvent.indexOf('.'));
                emitForEvent(currentEvent);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
