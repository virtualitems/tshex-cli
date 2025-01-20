// Libraries

// Same Layer

import type Event from './Event.js';

// Lower Layers

// Types

// Constants


/**
 * @description 
 */
export default abstract class EventHandler
{

    [property: string]: unknown;

    // public ATTRIBUTES

    // protected ATTRIBUTES

    // private ATTRIBUTES

    // public static ATTRIBUTES

    // protected static ATTRIBUTES

    // private static ATTRIBUTES

    // Constructor, Getters, Setters

    // public METHODS

    public abstract handle(event: Event): Promise<void>;

    // protected METHODS

    // private METHODS

    // public static METHODS

    // protected static METHODS

    // private static METHODS

} //:: class
