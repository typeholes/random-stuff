# composable states

attempt to make small states that compose well.

inspired by a discussion about the paxos protocol where a state change can be accepted, partially accepted, or rejected. I simplify this to state changes that can choose to use a portion of the input and return the unused portion.

Using multiple small states works well. The current composition of states is most likely ill defined. The example of an additive state on top of a state that rejects values beyond a maximum works. I suspect it will fall apart with more complex behaviors and multiple levels of composition.
